import { useState, useEffect, useRef } from 'react';

export const TRANSLATIONS = {
  en: {
    nav_home: 'Home', nav_services: 'Services', nav_portfolio: 'Portfolio', nav_blog: 'Blog', nav_contact: 'Contact',
    home_label: 'Full-Stack Developer & Designer',
    home_title_1: 'Crafting', home_title_2: 'digital', home_title_3: 'experiences',
    home_desc: 'I build elegant, high-performance web solutions that transform ideas into impactful digital products.',
    home_cta_start: 'Start a project', home_cta_work: 'View work',
    scroll: 'Scroll',
    home_what: 'What I do', home_services: 'Services',
    svc_web_t: 'Web Development', svc_web_d: 'Modern, performant web applications built with cutting-edge technologies.',
    svc_ui_t: 'UI/UX Design', svc_ui_d: 'Intuitive interfaces designed with your users in mind.',
    svc_ai_t: 'AI Integration', svc_ai_d: 'Intelligent solutions powered by the latest in machine learning.',
    svc_cons_t: 'Consulting', svc_cons_d: 'Strategic guidance for your digital transformation journey.',
    all_services: 'All services',
    selected_work: 'Selected work', portfolio: 'Portfolio',
    view_all_projects: 'View all projects',
    lets_work: "Let's work together",
    home_cta_q: 'Have a project in', mind: 'mind',
    get_in_touch: 'Get in touch',
    stat_years: 'Years Experience', stat_projects: 'Projects Delivered', stat_clients: 'Happy Clients', stat_sat: 'Client Satisfaction',
    services_page_title1: 'What I', services_page_title2: 'do',
    services_page_desc: 'End-to-end digital solutions — from concept to deployment and beyond. Every project is treated as a partnership.',
    svc_full_web_t: 'Web Development',
    svc_full_web_d: 'Custom web applications built with React, Next.js, Node.js, and modern frameworks. From SPAs to full-stack platforms — performant, accessible, and scalable.',
    svc_full_ui_t: 'UI/UX Design',
    svc_full_ui_d: 'User-centered design that bridges beauty and function. Research-driven interfaces that convert visitors into users and users into advocates.',
    svc_full_ai_t: 'AI Integration',
    svc_full_ai_d: 'Harness the power of artificial intelligence. From chatbots to recommendation engines, I integrate smart solutions into your existing products.',
    svc_full_cons_t: 'Consulting',
    svc_full_cons_d: 'Strategic technology guidance for startups and enterprises. Architecture reviews, tech stack selection, and digital transformation roadmaps.',
    svc_full_form_t: 'Formation & Mentoring',
    svc_full_form_d: 'Level up your team with tailored training programs. From junior onboarding to advanced workshops on modern web technologies.',
    svc_full_db_t: 'Database Design',
    svc_full_db_d: 'Robust data architectures that scale. Schema design, migration strategies, and optimization for PostgreSQL, MongoDB, and beyond.',
    process: 'Process', how_i_work: 'How I work',
    step1_t: 'Discovery', step1_d: 'Understanding your vision, goals, users, and constraints.',
    step2_t: 'Design', step2_d: 'Wireframes, prototypes, and iterative visual design.',
    step3_t: 'Develop', step3_d: 'Clean, tested, production-ready code.',
    step4_t: 'Deliver', step4_d: 'Launch, monitor, iterate, and support.',
    ready_to: 'Ready to', start: 'start', lets_talk: "Let's talk",
    portfolio_title1: 'Selected', portfolio_title2: 'work',
    portfolio_desc: 'A curated selection of projects spanning web applications, mobile, and AI solutions.',
    view_project: 'View project',
    cat_all: 'All', cat_webapp: 'Web App', cat_mobile: 'Mobile', cat_ai: 'AI',
    blog: 'Blog', blog_title1: 'Thoughts &', blog_title2: 'insights',
    blog_desc: 'Writing about web development, design, AI, and the craft of building digital products.',
    read: 'read', back_to_blog: 'Back to blog',
    all_articles: '← All articles', discuss_this: 'Discuss this →',
    contact: 'Contact', contact_title1: "Let's", contact_title2: 'talk',
    contact_desc: "Have a project in mind? I'd love to hear about it. Fill out the form or use the chat — I typically respond within 24 hours.",
    form_name: 'Name', form_email: 'Email', form_subject: 'Subject', form_message: 'Message',
    form_name_ph: 'John Doe', form_email_ph: 'john@example.com', form_subject_ph: 'Project inquiry', form_message_ph: 'Tell me about your project...',
    form_send: 'Send message', form_sent: 'Message sent', form_sent_desc: "I'll get back to you within 24 hours.",
    based_in: 'Based in', location: 'Belgium', remote: 'Available for remote work worldwide',
    social: 'Social', available: '"Available for new projects"',
    available_desc: 'Currently accepting freelance work and consulting engagements starting Q2 2026.',
    chat_title: 'Chat', chat_status: 'Usually responds within 1 hour',
    chat_greet: "Hi! I'm Joseph's assistant. How can I help you today?",
    chat_qr_1: 'Services & pricing', chat_qr_2: 'Project timeline', chat_qr_3: 'Book a call',
    chat_reply_1: "I offer web development, UI/UX design, AI integration, consulting, and mentoring. Pricing depends on scope — typically €80-150/hr. Want me to set up a call to discuss your project?",
    chat_reply_2: "Most projects take 4-12 weeks depending on complexity. I'll provide a detailed timeline after our initial discussion. Shall I schedule a discovery call?",
    chat_reply_3: "Great! You can reach Joseph directly at hello@josephpire.dev, or fill out the contact form on this page. He typically responds within 24 hours.",
    chat_reply_default: "Thanks for your message! Joseph will get back to you soon. For immediate inquiries, email hello@josephpire.dev.",
    chat_input_ph: 'Type a message...',
    footer_tagline: 'Full-stack developer crafting digital experiences that matter.',
    navigation: 'Navigation', connect: 'Connect', footer_contact: 'Get in touch',
    rights: '© 2026 Joseph Pire. All rights reserved.',
    built_with: 'Built with passion & clean code',
    back_to_portfolio: 'Back to portfolio',
    project_stack: 'Tech Stack',
    view_live: 'View live',
    view_code: 'View code',
    all_projects_link: '← All projects',
    discuss_project: 'Discuss this project →',
  },
  fr: {
    nav_home: 'Accueil', nav_services: 'Services', nav_portfolio: 'Projets', nav_blog: 'Blog', nav_contact: 'Contact',
    home_label: 'Développeur Full-Stack & Designer',
    home_title_1: 'Créer des', home_title_2: 'expériences', home_title_3: 'digitales',
    home_desc: 'Je conçois des solutions web élégantes et performantes qui transforment vos idées en produits digitaux marquants.',
    home_cta_start: 'Démarrer un projet', home_cta_work: 'Voir mes projets',
    scroll: 'Défiler',
    home_what: 'Ce que je fais', home_services: 'Services',
    svc_web_t: 'Développement Web', svc_web_d: 'Applications web modernes et performantes, bâties avec les technologies les plus avancées.',
    svc_ui_t: 'Design UI/UX', svc_ui_d: 'Des interfaces intuitives pensées pour vos utilisateurs.',
    svc_ai_t: 'Intégration IA', svc_ai_d: 'Des solutions intelligentes propulsées par les dernières avancées en machine learning.',
    svc_cons_t: 'Consulting', svc_cons_d: 'Un accompagnement stratégique pour votre transformation digitale.',
    all_services: 'Tous les services',
    selected_work: 'Projets sélectionnés', portfolio: 'Portfolio',
    view_all_projects: 'Voir tous les projets',
    lets_work: 'Travaillons ensemble',
    home_cta_q: 'Un projet en', mind: 'tête',
    get_in_touch: 'Me contacter',
    stat_years: "Années d'expérience", stat_projects: 'Projets livrés', stat_clients: 'Clients satisfaits', stat_sat: 'Satisfaction client',
    services_page_title1: 'Ce que', services_page_title2: 'je fais',
    services_page_desc: 'Des solutions digitales de bout en bout — de la conception au déploiement. Chaque projet est un partenariat.',
    svc_full_web_t: 'Développement Web',
    svc_full_web_d: 'Applications web sur mesure construites avec React, Next.js, Node.js et les frameworks modernes. Du SPA aux plateformes full-stack — performantes, accessibles et évolutives.',
    svc_full_ui_t: 'Design UI/UX',
    svc_full_ui_d: 'Un design centré utilisateur qui marie beauté et fonction. Des interfaces issues de la recherche qui convertissent les visiteurs en utilisateurs.',
    svc_full_ai_t: 'Intégration IA',
    svc_full_ai_d: "Exploitez la puissance de l'intelligence artificielle. Des chatbots aux moteurs de recommandation, j'intègre des solutions intelligentes à vos produits.",
    svc_full_cons_t: 'Consulting',
    svc_full_cons_d: "Conseils stratégiques pour startups et entreprises. Audits d'architecture, choix de stack et feuilles de route digitales.",
    svc_full_form_t: 'Formation & Mentorat',
    svc_full_form_d: "Faites monter votre équipe en compétences grâce à des programmes sur mesure. De l'onboarding junior aux workshops avancés.",
    svc_full_db_t: 'Architecture de Bases de Données',
    svc_full_db_d: 'Des architectures de données robustes et évolutives. Design de schémas, stratégies de migration et optimisation pour PostgreSQL, MongoDB et plus.',
    process: 'Processus', how_i_work: 'Ma méthode',
    step1_t: 'Découverte', step1_d: 'Comprendre votre vision, vos objectifs, vos utilisateurs et vos contraintes.',
    step2_t: 'Design', step2_d: 'Wireframes, prototypes et design visuel itératif.',
    step3_t: 'Développement', step3_d: 'Un code propre, testé, prêt pour la production.',
    step4_t: 'Livraison', step4_d: 'Mise en ligne, suivi, itération et support.',
    ready_to: 'Prêt à', start: 'commencer', lets_talk: 'Discutons-en',
    portfolio_title1: 'Projets', portfolio_title2: 'sélectionnés',
    portfolio_desc: "Une sélection de projets couvrant applications web, mobile et solutions d'IA.",
    view_project: 'Voir le projet',
    cat_all: 'Tous', cat_webapp: 'Web', cat_mobile: 'Mobile', cat_ai: 'IA',
    blog: 'Blog', blog_title1: 'Pensées &', blog_title2: 'idées',
    blog_desc: "J'écris sur le développement web, le design, l'IA et l'art de construire des produits digitaux.",
    read: 'min', back_to_blog: 'Retour au blog',
    all_articles: '← Tous les articles', discuss_this: 'En discuter →',
    contact: 'Contact', contact_title1: 'Parlons', contact_title2: 'ensemble',
    contact_desc: "Un projet en tête ? J'adorerais en entendre parler. Remplissez le formulaire ou utilisez le chat — je réponds sous 24 h.",
    form_name: 'Nom', form_email: 'Email', form_subject: 'Sujet', form_message: 'Message',
    form_name_ph: 'Jean Dupont', form_email_ph: 'jean@exemple.com', form_subject_ph: 'Demande de projet', form_message_ph: 'Parlez-moi de votre projet...',
    form_send: 'Envoyer', form_sent: 'Message envoyé', form_sent_desc: 'Je reviens vers vous sous 24 heures.',
    based_in: 'Basé en', location: 'Belgique', remote: 'Disponible pour du télétravail partout dans le monde',
    social: 'Réseaux', available: '« Disponible pour nouveaux projets »',
    available_desc: "J'accepte actuellement des missions freelance et du consulting à partir du Q2 2026.",
    chat_title: 'Chat', chat_status: 'Répond sous 1 heure en général',
    chat_greet: "Bonjour ! Je suis l'assistant de Joseph. Comment puis-je vous aider ?",
    chat_qr_1: 'Services & tarifs', chat_qr_2: 'Délais de projet', chat_qr_3: 'Prendre RDV',
    chat_reply_1: "Je propose du développement web, du design UI/UX, de l'intégration IA, du consulting et du mentorat. Les tarifs dépendent du périmètre — typiquement 80-150€/h. Voulez-vous organiser un appel ?",
    chat_reply_2: "La plupart des projets prennent 4 à 12 semaines selon la complexité. Je fournirai un planning détaillé après notre première discussion. Planifions-nous un appel découverte ?",
    chat_reply_3: "Parfait ! Vous pouvez joindre Joseph directement à hello@josephpire.dev, ou remplir le formulaire de contact sur cette page. Il répond typiquement sous 24 heures.",
    chat_reply_default: 'Merci pour votre message ! Joseph vous répondra bientôt. Pour toute urgence, écrivez à hello@josephpire.dev.',
    chat_input_ph: 'Écrivez un message...',
    footer_tagline: 'Développeur full-stack créant des expériences digitales qui comptent.',
    navigation: 'Navigation', connect: 'Connecter', footer_contact: 'Me contacter',
    rights: '© 2026 Joseph Pire. Tous droits réservés.',
    built_with: 'Conçu avec passion & code propre',
    back_to_portfolio: 'Retour au portfolio',
    project_stack: 'Stack technique',
    view_live: 'Voir le site',
    view_code: 'Voir le code',
    all_projects_link: '← Tous les projets',
    discuss_project: 'Discuter de ce projet →',
  },
  nl: {
    nav_home: 'Home', nav_services: 'Diensten', nav_portfolio: 'Projecten', nav_blog: 'Blog', nav_contact: 'Contact',
    home_label: 'Full-Stack Developer & Designer',
    home_title_1: 'Digitale', home_title_2: 'ervaringen', home_title_3: 'creëren',
    home_desc: 'Ik bouw elegante, krachtige weboplossingen die ideeën omzetten in impactvolle digitale producten.',
    home_cta_start: 'Start een project', home_cta_work: 'Bekijk werk',
    scroll: 'Scroll',
    home_what: 'Wat ik doe', home_services: 'Diensten',
    svc_web_t: 'Webontwikkeling', svc_web_d: 'Moderne, krachtige webapplicaties gebouwd met de nieuwste technologieën.',
    svc_ui_t: 'UI/UX Design', svc_ui_d: 'Intuïtieve interfaces ontworpen met uw gebruikers in gedachten.',
    svc_ai_t: 'AI-integratie', svc_ai_d: 'Intelligente oplossingen aangedreven door de nieuwste machine learning.',
    svc_cons_t: 'Consulting', svc_cons_d: 'Strategische begeleiding voor uw digitale transformatie.',
    all_services: 'Alle diensten',
    selected_work: 'Geselecteerd werk', portfolio: 'Portfolio',
    view_all_projects: 'Bekijk alle projecten',
    lets_work: 'Laten we samenwerken',
    home_cta_q: 'Een project in', mind: 'gedachten',
    get_in_touch: 'Neem contact op',
    stat_years: 'Jaren ervaring', stat_projects: 'Geleverde projecten', stat_clients: 'Tevreden klanten', stat_sat: 'Klanttevredenheid',
    services_page_title1: 'Wat ik', services_page_title2: 'doe',
    services_page_desc: 'End-to-end digitale oplossingen — van concept tot lancering en verder. Elk project is een partnerschap.',
    svc_full_web_t: 'Webontwikkeling',
    svc_full_web_d: 'Maatwerk webapplicaties gebouwd met React, Next.js, Node.js en moderne frameworks. Van SPAs tot full-stack platformen — krachtig, toegankelijk en schaalbaar.',
    svc_full_ui_t: 'UI/UX Design',
    svc_full_ui_d: 'Gebruikersgericht ontwerp dat schoonheid en functie verbindt. Research-driven interfaces die bezoekers omzetten in gebruikers.',
    svc_full_ai_t: 'AI-integratie',
    svc_full_ai_d: 'Benut de kracht van kunstmatige intelligentie. Van chatbots tot aanbevelingsmotoren, ik integreer slimme oplossingen in uw producten.',
    svc_full_cons_t: 'Consulting',
    svc_full_cons_d: 'Strategisch technologie-advies voor startups en ondernemingen. Architectuuraudits, stackkeuze en digitale roadmaps.',
    svc_full_form_t: 'Opleiding & Mentoring',
    svc_full_form_d: 'Til uw team naar een hoger niveau met maatwerk trainingen. Van junior onboarding tot geavanceerde workshops.',
    svc_full_db_t: 'Databaseontwerp',
    svc_full_db_d: 'Robuuste data-architecturen die schalen. Schemaontwerp, migratiestrategieën en optimalisatie voor PostgreSQL, MongoDB en meer.',
    process: 'Proces', how_i_work: 'Hoe ik werk',
    step1_t: 'Ontdekking', step1_d: 'Uw visie, doelen, gebruikers en beperkingen begrijpen.',
    step2_t: 'Ontwerp', step2_d: 'Wireframes, prototypes en iteratief visueel ontwerp.',
    step3_t: 'Ontwikkelen', step3_d: 'Schone, geteste, productieklare code.',
    step4_t: 'Leveren', step4_d: 'Lanceren, monitoren, itereren en ondersteunen.',
    ready_to: 'Klaar om te', start: 'starten', lets_talk: 'Laten we praten',
    portfolio_title1: 'Geselecteerd', portfolio_title2: 'werk',
    portfolio_desc: 'Een geselecteerde reeks projecten, van webapplicaties tot mobile en AI-oplossingen.',
    view_project: 'Bekijk project',
    cat_all: 'Alles', cat_webapp: 'Web', cat_mobile: 'Mobile', cat_ai: 'AI',
    blog: 'Blog', blog_title1: 'Gedachten &', blog_title2: 'inzichten',
    blog_desc: 'Ik schrijf over webontwikkeling, design, AI en het maken van digitale producten.',
    read: 'min', back_to_blog: 'Terug naar blog',
    all_articles: '← Alle artikelen', discuss_this: 'Bespreek dit →',
    contact: 'Contact', contact_title1: 'Laten we', contact_title2: 'praten',
    contact_desc: 'Een project in gedachten? Ik hoor er graag over. Vul het formulier in of gebruik de chat — ik reageer meestal binnen 24 uur.',
    form_name: 'Naam', form_email: 'Email', form_subject: 'Onderwerp', form_message: 'Bericht',
    form_name_ph: 'Jan Janssen', form_email_ph: 'jan@voorbeeld.com', form_subject_ph: 'Projectaanvraag', form_message_ph: 'Vertel me over uw project...',
    form_send: 'Bericht verzenden', form_sent: 'Bericht verzonden', form_sent_desc: 'Ik reageer binnen 24 uur.',
    based_in: 'Gevestigd in', location: 'België', remote: 'Beschikbaar voor remote werk wereldwijd',
    social: 'Sociaal', available: '"Beschikbaar voor nieuwe projecten"',
    available_desc: 'Momenteel beschikbaar voor freelance en consulting opdrachten vanaf Q2 2026.',
    chat_title: 'Chat', chat_status: 'Reageert meestal binnen 1 uur',
    chat_greet: 'Hallo! Ik ben de assistent van Joseph. Hoe kan ik u helpen?',
    chat_qr_1: 'Diensten & tarieven', chat_qr_2: 'Projecttijdlijn', chat_qr_3: 'Plan een gesprek',
    chat_reply_1: 'Ik bied webontwikkeling, UI/UX design, AI-integratie, consulting en mentoring aan. Tarieven hangen af van de scope — typisch €80-150/uur. Zullen we een gesprek plannen?',
    chat_reply_2: 'De meeste projecten duren 4-12 weken afhankelijk van de complexiteit. Ik geef een gedetailleerde tijdlijn na ons eerste gesprek. Zullen we een kennismaking plannen?',
    chat_reply_3: 'Prima! U kunt Joseph rechtstreeks bereiken op hello@josephpire.dev, of het contactformulier op deze pagina invullen. Hij reageert meestal binnen 24 uur.',
    chat_reply_default: 'Bedankt voor uw bericht! Joseph neemt spoedig contact op. Voor dringende zaken, mail naar hello@josephpire.dev.',
    chat_input_ph: 'Typ een bericht...',
    footer_tagline: 'Full-stack developer die digitale ervaringen creëert die er toe doen.',
    navigation: 'Navigatie', connect: 'Verbind', footer_contact: 'Neem contact op',
    rights: '© 2026 Joseph Pire. Alle rechten voorbehouden.',
    built_with: 'Gebouwd met passie & schone code',
    back_to_portfolio: 'Terug naar portfolio',
    project_stack: 'Tech Stack',
    view_live: 'Bekijk live',
    view_code: 'Bekijk code',
    all_projects_link: '← Alle projecten',
    discuss_project: 'Bespreek dit project →',
  },
} as const;

export type Lang = keyof typeof TRANSLATIONS;

export function localePath(lang: Lang, path: string): string {
  return lang === 'fr' ? path : `/${lang}${path}`;
}

export function getTheme(): string {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem('jp-theme') || 'dark';
}

export function applyTheme(theme: string) {
  localStorage.setItem('jp-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new CustomEvent('jp-theme-change', { detail: theme }));
}

export function useLang(lang: Lang = 'fr') {
  const t = (key: string): string =>
    (TRANSLATIONS[lang] as Record<string, string>)[key] ?? key;
  return { lang, t };
}

export function useTheme() {
  const [theme, setThemeState] = useState<string>('dark');

  useEffect(() => {
    setThemeState(getTheme());
    const handler = (e: Event) => setThemeState((e as CustomEvent<string>).detail);
    window.addEventListener('jp-theme-change', handler);
    return () => window.removeEventListener('jp-theme-change', handler);
  }, []);

  const toggle = () => applyTheme(theme === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}

export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function useRevealEffect() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.15 }
    );
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function useAnimatedCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setCount(Math.round(eased * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return { count, ref };
}
