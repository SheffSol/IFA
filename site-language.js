/* Shared language integration for the existing page, article and book modules. */
(() => {
  const root = document.documentElement;
  const textOriginals = new Map();
  const attributeOriginals = new Map();
  const normalise = value => String(value).replace(/\s+/g, ' ').trim();
  let observer;
  let scheduled = false;

  function rememberAndTranslate(node, dictionary) {
    const value = node.nodeValue;
    const key = normalise(value);
    const replacement = dictionary?.[key];
    if (replacement && replacement !== key) {
      if (!textOriginals.has(node)) textOriginals.set(node, value);
      const start = value.indexOf(value.trim());
      node.nodeValue = value.slice(0, start) + replacement + value.slice(start + value.trim().length);
    }
  }

  function restore() {
    for (const [node, value] of textOriginals) if (node.isConnected) node.nodeValue = value;
    for (const [element, attributes] of attributeOriginals) {
      if (element.isConnected) for (const [key,value] of Object.entries(attributes)) element.setAttribute(key,value);
    }
    textOriginals.clear();
    attributeOriginals.clear();
  }

  function arrowSvg(direction) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    svg.classList.add('link-icon');
    const path = document.createElementNS(svg.namespaceURI,'path');
    path.setAttribute('d',direction === '←' ? 'M20 12H4m6-6-6 6 6 6' : direction === '↗' ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6');
    svg.append(path);
    return svg;
  }

  function apply() {
    scheduled = false;
    observer?.disconnect();
    const language = ['ru','en','kk'].includes(root.lang) ? root.lang : 'ru';
    document.querySelectorAll('.main-nav > a').forEach(link => {
      const target = new URL(link.href, location.href).pathname.replace(/\.html$/, '').replace(/\/$/, '');
      const current = location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
      if (target === current) link.setAttribute('aria-current', 'page');
    });
    document.querySelectorAll('[data-site-ru]').forEach(element => {
      const value = element.dataset[`site${language[0].toUpperCase()+language.slice(1)}`] || element.dataset.siteRu;
      if (element.textContent !== value) element.textContent = value;
    });
    document.querySelectorAll('[data-site-alt-ru]').forEach(image=>{
      image.alt=image.dataset[`siteAlt${language[0].toUpperCase()+language.slice(1)}`]||image.dataset.siteAltRu;
    });
    if (language === 'kk' || language === 'en') {
      const dictionary = language === 'kk' ? window.ifaKazakh : window.ifaEnglish;
      const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      const texts=[]; let node;
      while ((node=walker.nextNode())) {
        if (!node.parentElement?.closest('script,style,svg,[data-site-ru]')) texts.push(node);
      }
      texts.forEach(node=>rememberAndTranslate(node,dictionary));
      document.querySelectorAll('[alt],[aria-label],[title],[placeholder]').forEach(element => {
        for(const name of ['alt','aria-label','title','placeholder']) {
          const original=element.getAttribute(name);
          const translated=dictionary?.[normalise(original||'')];
          if (translated && translated !== original) {
            if(!attributeOriginals.has(element)) attributeOriginals.set(element,{});
            const values=attributeOriginals.get(element);
            if(!(name in values)) values[name]=original;
            element.setAttribute(name,translated);
          }
        }
      });
      const title=dictionary?.[normalise(document.title)];
      if(title) document.title=title;
      document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').forEach(meta=>{
        const translated=dictionary?.[normalise(meta.content)];
        if(translated && translated !== meta.content) {
          if(!attributeOriginals.has(meta)) attributeOriginals.set(meta,{});
          const values=attributeOriginals.get(meta);
          if(!('content' in values)) values.content=meta.content;
          meta.content=translated;
        }
      });
    }
    // SVG paths render identically on iOS, Android and desktop, unlike emoji.
    document.querySelectorAll('a,button').forEach(link=>{
      const walker=document.createTreeWalker(link,NodeFilter.SHOW_TEXT);
      const nodes=[]; let node;
      while((node=walker.nextNode())) if(!node.parentElement?.closest('svg') && /[↗→←↘➡➜]/u.test(node.nodeValue)) nodes.push(node);
      for(const text of nodes) {
        const direction=text.nodeValue.match(/[↗→←↘➡➜]/u)[0];
        text.nodeValue=text.nodeValue.replace(/[↗→←↘➡➜]\uFE0F?/gu,'').trimEnd();
        const originalContainer = text.parentElement?.matches('i') ? text.parentElement : link;
        if(!link.querySelector('.link-icon')) originalContainer.append(arrowSvg(direction));
      }
    });
    document.querySelectorAll('[data-lang]').forEach(button=>{
      const active=button.dataset.lang===language;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('.organisation-register').forEach(table=>{
      const labels=[...table.querySelectorAll('thead th')].map(th=>th.textContent);
      table.setAttribute('role','table');
      table.querySelectorAll('tbody tr').forEach(row=>{
        row.setAttribute('role','row');
        [...row.children].forEach((cell,index)=>{cell.dataset.label=labels[index]||'';cell.setAttribute('role','cell');});
      });
    });
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content',language==='kk'?'kk_KZ':language==='en'?'en_US':'ru_KZ');
    const canonical = document.querySelector('link[rel="canonical"]');
    if(canonical) {
      const url=new URL(canonical.href);
      url.search=language==='ru'?'':`?lang=${language}`;
      canonical.href=url.href;
    }
    observe();
  }

  function observe() {
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    observer.observe(root,{attributes:true,attributeFilter:['lang']});
  }
  function schedule() { if(!scheduled) { scheduled=true; queueMicrotask(apply); } }
  observer=new MutationObserver(schedule);
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-lang]');
    if(!button) return;
    observer.disconnect();
    restore();
    // A microtask from a capture listener may run before target listeners.
    // Apply after their original language setters have finished.
    setTimeout(apply, 0);
  },true);
  apply();
})();
