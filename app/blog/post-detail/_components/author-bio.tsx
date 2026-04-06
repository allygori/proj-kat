import Image from 'next/image';
import { Mail, Globe } from 'lucide-react';

interface AuthorBioProps {
  name: string;
  bio: string;
  image?: string;
}

export function AuthorBio({
  name,
  bio,
  image,
}: AuthorBioProps) {
  return (
    <section className="mt-24 bg-[#f2f3f8] dark:bg-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
      <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 grayscale">
        {
          image &&
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        }
      </div>
      <div className="flex-1 text-center md:text-left">
        <h4 className="font-sans font-bold text-xl text-[#00466e] dark:text-sky-300 mb-2">
          {name}
        </h4>
        <p className="font-sans text-[#41474f] dark:text-slate-400 mb-4 text-pretty">
          {bio}
        </p>
        <div className="flex justify-center md:justify-start gap-4 text-[#00466e] dark:text-sky-300">
          <button className="p-2 hover:bg-[#00466e]/10 rounded-full transition-colors">
            <Mail className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-[#00466e]/10 rounded-full transition-colors">
            <Globe className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
