import { useLanguage } from "../i18n/LanguageContext";

const contactText = {
  English: {
    title: "Contact Amaan Capital",
    description: "Get in touch with our team.",
  },
  French: {
    title: "Contacter Amaan Capital",
    description: "Contactez notre équipe.",
  },
  German: {
    title: "Amaan Capital kontaktieren",
    description: "Kontaktieren Sie unser Team.",
  },
  Italian: {
    title: "Contatta Amaan Capital",
    description: "Contatta il nostro team.",
  },
  Spanish: {
    title: "Contacta con Amaan Capital",
    description: "Ponte en contacto con nuestro equipo.",
  },
  Filipino: {
    title: "Makipag-ugnayan sa Amaan Capital",
    description: "Makipag-ugnayan sa aming team.",
  },
} as const;

function Contact() {
  const { language } = useLanguage();
  const text = contactText[language] ?? contactText.English;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-yellow-400">
        {text.title}
      </h1>

      <p className="text-gray-400 mt-4">
        {text.description}
      </p>
    </div>
  );
}

export default Contact;
