import { useLanguage } from "../i18n/LanguageContext";

const aboutText = {
  English: {
    title: "About Amaan Capital",
    description:
      "Learn more about Amaan Capital and our vision for digital finance.",
  },
  French: {
    title: "À propos d'Amaan Capital",
    description:
      "Découvrez Amaan Capital et notre vision de la finance numérique.",
  },
  German: {
    title: "Über Amaan Capital",
    description:
      "Erfahren Sie mehr über Amaan Capital und unsere Vision für digitale Finanzen.",
  },
  Italian: {
    title: "Informazioni su Amaan Capital",
    description:
      "Scopri di più su Amaan Capital e sulla nostra visione per la finanza digitale.",
  },
  Spanish: {
    title: "Sobre Amaan Capital",
    description:
      "Conoce más sobre Amaan Capital y nuestra visión de las finanzas digitales.",
  },
  Filipino: {
    title: "Tungkol sa Amaan Capital",
    description:
      "Alamin ang higit pa tungkol sa Amaan Capital at sa aming pananaw para sa digital finance.",
  },
} as const;

function About() {
  const { language } = useLanguage();
  const text = aboutText[language] ?? aboutText.English;

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

export default About;
