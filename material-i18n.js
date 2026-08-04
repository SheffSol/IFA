(() => {
  const page = document.body.dataset.materialPage;
  if (!page) return;

  const sharedText = {
    "Полезное": "Resources",
    "Содержание": "Contents",
    "Следующий материал": "Next article",
    "Вернуться к началу серии": "Return to the beginning of the series",
    "Редакция 2026": "2026 edition",
    "8 минут": "8 min",
    "10 минут": "10 min",
  };

  const sharedAttributes = {
    "IFA — на главную": "IFA — Home",
    "Выбор языка": "Language selector",
    "Содержание материала": "Article contents",
    "Перейти к следующему материалу": "Go to the next article",
    "Перейти к первому материалу": "Go to the first article",
  };

  const pages = {
    silkRoad: {
      title: "How Kazakhstan Can Become a Hub for the Silk Road Motoring Route — IFA",
      description: "An IFA strategic briefing on Kazakhstan’s potential role in developing an international Silk Road motoring programme.",
      text: {
        "Стратегический обзор": "Strategic briefing",
        "Как Казахстан может стать опорной территорией автомобильного Шёлкового пути": "How Kazakhstan Can Become a Hub for the Silk Road Motoring Route",
        "Проектный взгляд на перспективную международную программу: какую роль может выполнять Казахстан, из каких элементов складывается автомобильное путешествие и что необходимо подготовить к планируемому этапу 2027 года.": "A strategic view of a prospective international programme: Kazakhstan’s role, the components of an overland journey and the work required for the planned 2027 stage.",
        "Контекст": "Context",
        "Роль Казахстана": "Kazakhstan’s role",
        "Архитектура маршрута": "Route architecture",
        "Подготовка 2027": "2027 preparation",
        "Коридор — это не линия на карте": "A corridor is more than a line on a map",
        "Международный автомаршрут становится туристическим продуктом только тогда, когда дорога, границы, сервисы, безопасность и культурное содержание работают как одна система.": "An international motoring route becomes a tourism product only when roads, borders, services, safety and cultural content operate as one coherent system.",
        "Для путешественника важна не только протяжённость пути. Ему необходимы понятные точки въезда, прогнозируемое время прохождения участков, подтверждённые места остановки, техническая поддержка и актуальная информация о правилах каждой страны.": "Distance alone is not enough for a traveller. A viable route needs clear entry points, predictable journey times, verified stops, technical support and current information on the rules of every country involved.",
        "Проектный подход IFA предлагает рассматривать Шёлковый путь как сеть связанных маршрутов, которые можно проходить поэтапно: от коротких региональных путешествий до более протяжённой международной программы.": "IFA’s project approach treats the Silk Road as a network of connected routes that can be travelled in stages, from short regional journeys to an extended international programme.",
        "Принцип IFA": "IFA principle",
        "Сначала подтверждается готовность каждого участка, затем формируется единый маршрутный сценарий и только после этого направление предлагается международному автопутешественнику.": "Each section is verified first. A unified route scenario is then assembled, and only after that is the journey presented to international motor travellers.",
        "Что делает Казахстан потенциальной опорной территорией": "Why Kazakhstan can become a strategic hub",
        "География страны соединяет Китай, Центральную Азию, Каспийское направление, Россию и дальнейшие маршруты в Европу. При этом Казахстан способен предложить самостоятельный туристический продукт: степные дороги, горные маршруты, исторические города и современные сервисные центры.": "Kazakhstan’s geography connects China, Central Asia, the Caspian corridor, Russia and onward routes to Europe. At the same time, the country can offer a complete tourism product of its own: steppe roads, mountain routes, historic cities and modern service centres.",
        "01 / ГЕОГРАФИЯ": "01 / GEOGRAPHY",
        "Связующее положение": "A connecting position",
        "Возможность проектировать южные, каспийские, северные и восточные автомобильные плечи.": "A platform for designing southern, Caspian, northern and eastern motoring corridors.",
        "02 / МАСШТАБ": "02 / SCALE",
        "Разные форматы путешествия": "Multiple journey formats",
        "От маршрута выходного дня до многонедельной международной экспедиции.": "From a weekend route to a multi-week international expedition.",
        "03 / НАСЛЕДИЕ": "03 / HERITAGE",
        "Содержание пути": "Meaningful route content",
        "Тараз, Туркестан, Отрар и другие точки формируют культурную логику южного коридора.": "Taraz, Turkistan, Otyrar and other destinations shape the cultural narrative of the southern corridor.",
        "04 / СЕРВИС": "04 / SERVICES",
        "Опорные города": "Gateway cities",
        "Алматы, Шымкент, Астана и Актау способны выступать центрами подготовки и сопровождения маршрутов.": "Almaty, Shymkent, Astana and Aktau can serve as centres for route preparation and support.",
        "Базовая архитектура южного направления": "Core architecture of the southern corridor",
        "Маршрут объединяет крупные транспортные узлы и культурно-исторические центры Казахстана и Центральной Азии. Каждый участок оценивается отдельно, включая состояние дороги, сезонность, сервисы и пограничные процедуры.": "The route connects major transport hubs and cultural and historic centres across Kazakhstan and Central Asia. Every section is assessed independently for road conditions, seasonality, services and border procedures.",
        "Алматы": "Almaty",
        "Тараз": "Taraz",
        "Шымкент": "Shymkent",
        "Ташкент": "Tashkent",
        "Самарканд": "Samarkand",
        "Проверка интервалов между топливными и сервисными точками": "Verify distances between fuel and service points",
        "Подготовка сценариев прохождения границы для разных категорий транспорта": "Prepare border-crossing scenarios for different vehicle categories",
        "Определение сезонных ограничений и альтернативных участков": "Identify seasonal restrictions and alternative sections",
        "Подбор остановок, размещения и культурной программы": "Select stops, accommodation and cultural programming",
        "Рабочая логика подготовки к 2027 году": "Working framework for the 2027 programme",
        "Полевое подтверждение": "Field verification",
        "Проверка ключевых участков, времени движения, сезонных рисков и доступности сервисов.": "Verify key sections, travel times, seasonal risks and service availability.",
        "Согласование маршрутного профиля": "Route profile coordination",
        "Сведение правил, требований и контактов по всем территориям маршрута.": "Consolidate rules, requirements and contacts across every territory on the route.",
        "Подготовка участников": "Participant preparation",
        "Памятки, чек-листы, требования к автомобилю и стандарты ответственного поведения.": "Briefings, checklists, vehicle requirements and standards of responsible conduct.",
        "Пилотный сезон": "Pilot season",
        "Запуск ограниченной программы с последующей оценкой качества и корректировкой маршрута.": "Launch a limited programme, evaluate its quality and refine the route.",
        "Как оценивается готовность международного автомобильного маршрута": "How the Readiness of an International Motoring Route Is Assessed",
      },
      attributes: {
        "Направление маршрута": "Route direction",
        "Транспортный коридор автомобильного Шёлкового пути через Казахстан": "Silk Road motoring corridor through Kazakhstan",
      },
    },

    routeReadiness: {
      title: "How the Readiness of an International Motoring Route Is Assessed — IFA Kazakhstan",
      description: "IFA methodology for assessing the operational readiness of an international motoring route.",
      text: {
        "Как оценивается готовность международного автомобильного маршрута": "How the Readiness of an International Motoring Route Is Assessed",
        "Практическая модель, которая переводит красивое направление в управляемый маршрут: с понятной логистикой, проверенными сервисами, правилами безопасности и актуальной информацией для путешественника.": "A practical model that turns an attractive destination into an operational route with clear logistics, verified services, safety protocols and current traveller information.",
        "Методология": "Methodology",
        "Определение": "Definition",
        "Шесть критериев": "Six criteria",
        "Процесс оценки": "Assessment process",
        "Результат": "Outcome",
        "Что означает «маршрут готов»": "What “route ready” means",
        "Готовность — это подтверждённая способность маршрута принимать путешественников в определённый сезон и обеспечивать прогнозируемый уровень безопасности, навигации и сервиса.": "Readiness is the verified ability of a route to receive travellers in a defined season and provide a predictable standard of safety, navigation and service.",
        "Оценка не заменяет официальные требования государств и не гарантирует неизменность условий. Её задача — собрать разрозненную информацию в один рабочий маршрутный профиль и заранее обозначить ограничения.": "The assessment does not replace official national requirements or guarantee that conditions will remain unchanged. Its purpose is to consolidate fragmented information into one operational route profile and identify limitations in advance.",
        "Главный вопрос методологии": "The methodology’s central question",
        "Сможет ли подготовленный автопутешественник пройти маршрут без критических информационных пробелов и получить понятный план действий при отклонении от сценария?": "Can a prepared motor traveller complete the route without critical information gaps and follow a clear contingency plan when conditions depart from the expected scenario?",
        "Шесть контуров оценки": "Six assessment dimensions",
        "01 / ДОРОГА": "01 / ROAD",
        "Проходимость и сезонность": "Passability and seasonality",
        "Покрытие, ремонтные участки, перевалы, погодные ограничения и альтернативные направления.": "Surface conditions, roadworks, mountain passes, weather restrictions and alternative directions.",
        "02 / ГРАНИЦЫ": "02 / BORDERS",
        "Трансграничные процедуры": "Cross-border procedures",
        "Документы, режим работы пунктов пропуска, транспортные требования и временные ограничения.": "Documents, border-post operating hours, vehicle requirements and temporary restrictions.",
        "03 / СЕРВИС": "03 / SERVICES",
        "Топливо и техническая помощь": "Fuel and technical assistance",
        "Дистанции между опорными точками, качество связи, ремонт и эвакуационные возможности.": "Distances between support points, communications coverage, repair services and recovery capacity.",
        "04 / БЕЗОПАСНОСТЬ": "04 / SAFETY",
        "Риски и сценарии реагирования": "Risks and response scenarios",
        "Сложные участки, медицинская доступность, резервные контакты и правила движения групп.": "Difficult sections, access to medical care, emergency contacts and group-driving procedures.",
        "05 / ТУРИЗМ": "05 / TOURISM",
        "Остановки и содержание пути": "Stops and route content",
        "Размещение, питание, природные территории, культурные объекты и допустимая нагрузка.": "Accommodation, food, natural areas, cultural sites and acceptable visitor capacity.",
        "06 / ИНФОРМАЦИЯ": "06 / INFORMATION",
        "Навигационная готовность": "Navigation readiness",
        "Актуальность координат, дорожных описаний, предупреждений и материалов на нужных языках.": "Current coordinates, road descriptions, alerts and materials in the required languages.",
        "От разведки до маршрутного паспорта": "From research to a route dossier",
        "Кабинетное исследование": "Desk research",
        "Сбор картографических, нормативных, сезонных и сервисных данных; выявление пробелов.": "Collect mapping, regulatory, seasonal and service data, and identify information gaps.",
        "Полевой проезд": "Field drive",
        "Фиксация фактического состояния участков, времени движения, связи и доступности точек поддержки.": "Record actual section conditions, travel times, connectivity and access to support points.",
        "Консультации на территории": "Local consultation",
        "Сверка информации с регионами, туроператорами, сервисными организациями и профессиональным сообществом.": "Validate information with regional authorities, tour operators, service organisations and professional communities.",
        "Риск-сессия": "Risk review",
        "Разбор отказных сценариев: закрытие дороги, задержка на границе, поломка, изменение погоды.": "Review failure scenarios: road closure, border delay, breakdown and changing weather.",
        "Паспорт маршрута": "Route dossier",
        "Единый документ с картой, сезонами, ограничениями, точками сервиса и чек-листами подготовки.": "A unified document containing the map, seasons, restrictions, service points and preparation checklists.",
        "Переоценка": "Reassessment",
        "Плановое обновление перед сезоном и внеплановая проверка при существенном изменении условий.": "Scheduled updates before the season and additional verification after material changes in conditions.",
        "Что получает путешественник и партнёр": "What travellers and partners receive",
        "Понятное описание уровня сложности и рекомендуемого сезона": "A clear description of difficulty and the recommended season",
        "Список обязательной подготовки автомобиля и экипажа": "A mandatory vehicle and crew preparation list",
        "Карта опорных сервисов и резервных вариантов": "A map of support services and contingency options",
        "Пограничный и документальный чек-лист": "A border and documentation checklist",
        "Сценарии действий при изменении маршрута": "Response scenarios for route changes",
        "Основа для туристического продукта или совместного проекта": "A foundation for a tourism product or joint project",
        "Международный водитель: документы, подготовка и ответственность": "International Driver: Documents, Preparation and Responsibility",
      },
      attributes: {
        "Оценка готовности международного автомобильного маршрута": "Assessment of an international motoring route’s readiness",
      },
    },

    internationalDriver: {
      title: "International Driver: Documents, Preparation and Responsibility — IFA Kazakhstan",
      description: "IFA guidance on International Driving Permits, travel documents, vehicle preparation and responsible international motoring.",
      text: {
        "Международный водитель: документы, подготовка и ответственность": "International Driver: Documents, Preparation and Responsibility",
        "В стандарте подготовки IFA Международное Водительское Удостоверение (МВУ) — обязательный элемент международной поездки. Разбираем, как оформить полный комплект документов, подготовить автомобиль и проверить требования всех стран маршрута.": "Under the IFA preparation standard, an International Driving Permit (IDP) is an essential part of an international journey. This guide explains how to assemble the complete document set, prepare the vehicle and verify the requirements of every country on the route.",
        "МВУ · обязательная подготовка": "IDP · essential preparation",
        "МВУ и документы": "IDP and documents",
        "Автомобиль": "Vehicle",
        "Граница": "Border",
        "Ответственность": "Responsibility",
        "МВУ и документы проверяются как единый комплект": "The IDP and supporting documents form one complete set",
        "До международной поездки необходимо обязательно оформить Международное Водительское Удостоверение. МВУ используется вместе с действующим национальным удостоверением и помогает подтвердить право управления автомобилем в понятном для зарубежных служб формате.": "Before travelling abroad, obtain an International Driving Permit. The IDP is used together with a valid national driving licence and presents the holder’s driving entitlement in a format readily understood by authorities abroad.",
        "Обязательный этап подготовки IFA": "Mandatory IFA preparation step",
        "Оформите МВУ до выезда за пределы страны": "Obtain your IDP before travelling abroad",
        "Международное Водительское Удостоверение не заменяет национальные права: в поездке необходимо иметь оба документа. Перед выездом дополнительно проверьте правила страны назначения, транзитных государств и условия прокатной компании.": "An International Driving Permit does not replace a national driving licence: carry both documents throughout the journey. Before departure, also verify the rules of the destination and transit countries and the requirements of the rental company.",
        "Официальный аккредитованный партнёр IFA": "Official accredited partner of IFA",
        "Оформление и выдача водительских документов международного образца.": "Processing and issuance of internationally recognised driving documents.",
        "Официальный сайт Ассоциации": "Official Association website",
        "Департамент выдачи МВУ": "IDP Issuing Department",
        "Международное Водительское Удостоверение (МВУ) вместе с действующим национальным удостоверением": "International Driving Permit (IDP) together with a valid national driving licence",
        "Паспорт и визовые основания с достаточным сроком действия": "Passport and valid visa documentation with sufficient remaining validity",
        "Свидетельство о регистрации автомобиля и подтверждение права управления": "Vehicle registration certificate and proof of authority to drive the vehicle",
        "Страховое покрытие, действующее на территории каждой страны маршрута": "Insurance coverage valid in every country on the route",
        "Документы на детей, животных, специальное оборудование и перевозимые товары": "Documents for children, animals, specialist equipment and transported goods",
        "Бумажные и защищённые цифровые копии ключевых документов": "Paper and securely stored digital copies of key documents",
        "Оформите МВУ заранее и проверьте требования маршрута": "Obtain the IDP in advance and verify route requirements",
        "Пограничные, визовые, страховые и водительские требования могут меняться. После оформления МВУ проведите финальную проверку по официальным каналам каждой страны маршрута непосредственно перед выездом.": "Border, visa, insurance and driving requirements may change. After obtaining the IDP, conduct a final check through the official channels of every country on the route immediately before departure.",
        "Автомобиль готовится под конкретную дорогу": "Prepare the vehicle for the specific route",
        "01 / ТЕХНИКА": "01 / MECHANICAL",
        "Базовая исправность": "Core roadworthiness",
        "Тормоза, шины, жидкости, свет, аккумулятор, охлаждение и отсутствие критических ошибок.": "Brakes, tyres, fluids, lighting, battery, cooling system and the absence of critical faults.",
        "02 / ЗАПАС": "02 / RESERVES",
        "Автономность": "Self-sufficiency",
        "Топливо, вода, питание, аптечка, связь и запас времени с учётом редких сервисных точек.": "Fuel, water, food, first-aid kit, communications and sufficient time allowance where services are limited.",
        "03 / ОСНАЩЕНИЕ": "03 / EQUIPMENT",
        "Требования стран": "National requirements",
        "Светоотражающие жилеты, знак аварийной остановки, огнетушитель, цепи и иное обязательное оснащение.": "High-visibility vests, warning triangle, fire extinguisher, snow chains and other mandatory equipment.",
        "04 / РЕЗЕРВ": "04 / CONTINGENCY",
        "План при неисправности": "Breakdown plan",
        "Контакты помощи, допустимый способ буксировки, запасное колесо и совместимые расходные материалы.": "Assistance contacts, permitted towing method, spare wheel and compatible consumables.",
        "Пограничный сценарий начинается до очереди": "Border preparation begins before the queue",
        "Сверьте пункт пропуска": "Verify the border crossing",
        "Убедитесь, что он принимает гражданство путешественника, категорию автомобиля и работает в нужное время.": "Confirm that it accepts the traveller’s nationality and vehicle category and is open at the intended time.",
        "Разложите документы": "Organise the documents",
        "Паспорт, национальное удостоверение, МВУ, регистрационные и страховые документы должны быть доступны без полного разбора багажа; копии хранятся отдельно.": "The passport, national driving licence, IDP, registration and insurance documents must be accessible without unpacking all luggage; copies should be stored separately.",
        "Декларируйте точно": "Declare accurately",
        "Не скрывайте оборудование, валюту, товары и иные предметы, подлежащие декларированию.": "Do not conceal equipment, currency, goods or any other items subject to declaration.",
        "Сохраняйте подтверждения": "Retain all records",
        "Документы временного ввоза, страховые полисы и квитанции хранятся до выезда из страны.": "Keep temporary import documents, insurance policies and receipts until leaving the country.",
        "Ответственная мобильность — часть маршрута": "Responsible mobility is part of the journey",
        "Международный автопутешественник представляет не только себя. Манера вождения, отношение к природным территориям, местным сообществам и дорожным правилам напрямую влияет на доверие к автотуризму.": "An international motor traveller represents more than themselves. Driving conduct and respect for natural areas, local communities and traffic rules directly influence public trust in autotourism.",
        "Соблюдайте местные ограничения скорости и режим отдыха": "Observe local speed limits and driving-rest requirements",
        "Не выезжайте за разрешённые дороги на охраняемых территориях": "Remain on authorised roads in protected areas",
        "Не создавайте стихийные стоянки и забирайте отходы с собой": "Avoid unauthorised camps and take all waste with you",
        "Учитывайте погоду и прекращайте движение до наступления критического риска": "Monitor the weather and stop before conditions become critical",
        "Сообщайте близким план движения и контрольные точки": "Share the travel plan and checkpoints with trusted contacts",
        "Уважайте решения пограничных, дорожных и природоохранных служб": "Respect the decisions of border, road and environmental authorities",
        "Как Казахстан может стать опорной территорией автомобильного Шёлкового пути": "How Kazakhstan Can Become a Hub for the Silk Road Motoring Route",
      },
      attributes: {
        "Паспорт и Международное Водительское Удостоверение на карте автомобильного маршрута": "Passport and International Driving Permit on a motoring route map",
      },
    },
  };

  const config = pages[page];
  if (!config) return;

  const textMap = { ...sharedText, ...config.text };
  const attributeMap = { ...sharedAttributes, ...config.attributes };
  const textRecords = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode;

  while ((textNode = walker.nextNode())) {
    const parentTag = textNode.parentElement?.tagName;
    if (parentTag === "SCRIPT" || parentTag === "STYLE") continue;
    textRecords.push({ node: textNode, value: textNode.nodeValue });
  }

  const attributeRecords = [];
  document.querySelectorAll("[aria-label], [alt]").forEach((element) => {
    ["aria-label", "alt"].forEach((name) => {
      if (element.hasAttribute(name)) {
        attributeRecords.push({ element, name, value: element.getAttribute(name) });
      }
    });
  });

  const originalMeta = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    ogLocale: document.querySelector('meta[property="og:locale"]')?.getAttribute("content") || "ru_KZ",
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "",
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute("content") || "",
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute("content") || "",
    twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute("content") || "",
  };

  const replaceText = (record, dictionary) => {
    const trimmed = record.value.trim();
    const translated = dictionary[trimmed];
    if (!translated) return;
    record.node.nodeValue = record.value.replace(trimmed, translated);
  };

  const setMeta = (selector, value) => {
    document.querySelector(selector)?.setAttribute("content", value);
  };

  const saveLanguage = (language) => {
    try {
      localStorage.setItem("ifa-language", language);
    } catch {
      // The switch remains functional when storage is unavailable.
    }
  };

  const getSavedLanguage = () => {
    try {
      return localStorage.getItem("ifa-language");
    } catch {
      return null;
    }
  };

  const applyLanguage = (language) => {
    const selected = language === "en" ? "en" : "ru";

    textRecords.forEach((record) => {
      record.node.nodeValue = record.value;
    });
    attributeRecords.forEach((record) => {
      record.element.setAttribute(record.name, record.value);
    });

    if (selected === "en") {
      textRecords.forEach((record) => replaceText(record, textMap));
      attributeRecords.forEach((record) => {
        const translated = attributeMap[record.value];
        if (translated) record.element.setAttribute(record.name, translated);
      });
      document.title = config.title;
      setMeta('meta[name="description"]', config.description);
      setMeta('meta[property="og:locale"]', "en_US");
      setMeta('meta[property="og:title"]', config.title.replace(/ — IFA(?: Kazakhstan)?$/, ""));
      setMeta('meta[property="og:description"]', config.description);
      setMeta('meta[name="twitter:title"]', config.title);
      setMeta('meta[name="twitter:description"]', config.description);
    } else {
      document.title = originalMeta.title;
      setMeta('meta[name="description"]', originalMeta.description);
      setMeta('meta[property="og:locale"]', originalMeta.ogLocale);
      setMeta('meta[property="og:title"]', originalMeta.ogTitle);
      setMeta('meta[property="og:description"]', originalMeta.ogDescription);
      setMeta('meta[name="twitter:title"]', originalMeta.twitterTitle);
      setMeta('meta[name="twitter:description"]', originalMeta.twitterDescription);
    }

    document.documentElement.lang = selected;
    document.querySelectorAll(".material-language-switch .lang-button").forEach((button) => {
      const active = button.dataset.lang === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    saveLanguage(selected);
  };

  document.querySelectorAll(".material-language-switch .lang-button").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  applyLanguage(getSavedLanguage() || "ru");
})();
