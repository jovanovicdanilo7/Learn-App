type TestimonialCardProps = {
  image: string;
  name: string;
  title: string;
  description: string;
};

function TestimonialCard({ image, name, title, description }: TestimonialCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg text-center p-6">
      <img
        src={image}
        alt={name}
        className="mx-auto rounded-full border-4 border-white shadow-sm mb-7"
      />
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <p className="text-sm text-indigo-600">{title}</p>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
}

export default TestimonialCard;
