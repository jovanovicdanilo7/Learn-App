type WelcomeMessageProps = {
  title: string | undefined;
  description: string;
};

function WelcomeMessage({ title, description }: WelcomeMessageProps) {
  return (
    <>
      <h1 className="text-4xl sm:text-5xl font-bold text-[#171A1F] mb-4 font-montserrat">
        {title}
      </h1>

      <p className="text-base sm:text-lg text-[#7D899C] max-w-2xl mx-auto mb-14 mt-10 font-montserrat">
        {description}
      </p>
    </>
  );
}

export default WelcomeMessage;
