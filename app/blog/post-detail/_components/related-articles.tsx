import Image from 'next/image';

interface RelatedCardProps {
  category: string;
  title: string;
  description: string;
  image: string;
  translateY?: boolean;
}

function RelatedCard({
  category,
  title,
  description,
  image,
  translateY = false,
}: RelatedCardProps) {
  return (
    <div className={`group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#e7e8ec] dark:border-slate-800 ${translateY ? 'md:translate-y-8' : ''}`}>
      <div className="h-48 overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-6">
        <span className="text-xs font-semibold text-[#356668] dark:text-teal-400 uppercase tracking-widest">
          {category}
        </span>
        <h3 className="font-sans font-bold text-lg mt-2 group-hover:text-[#00466e] dark:group-hover:text-sky-300 transition-colors line-clamp-2 text-[#191c1f] dark:text-white leading-tight">
          {title}
        </h3>
        <p className="font-sans text-sm mt-3 line-clamp-2 text-[#41474f] dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export function RelatedArticles() {
  const articles = [
    {
      category: 'Technology',
      title: 'Precision Lasers: The End of The Drill?',
      description: 'Explore how minimally invasive laser technology is reshaping patient comfort and recovery times.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTGWjquxY6WceK6-AluyDLJshMLIx2Dw-oOyVkDBd_TLNsa5mgIR9YjojIe3szahv0Tk35qqfLdnXNxBSacRhtEB6BsrDOA0drhV0vt_uOEs1rLceAwzE12aXe82AZXhSb2-gfc63T7-mfGb86WfM78KSW9RMd05ZNHm9eY864GyHlvXMGMoDmymxdfbsJxbUUHPc3IeN0Ol1fjmTQ_2nii5XNJ43005FAUTFyw557JXLimyCIRvqtQfD-AUayfMbx-cPUaCAFwC4',
    },
    {
      category: 'Lifestyle',
      title: 'The Bio-Availability of Enamel Repair',
      description: 'How nutrition and topical agents work together to naturally remineralize tooth structure.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsKs6mY-ecNrivop44OHD-QlHN0vVSFwrPL4U2GvS93rDuF4k9Pa5qhWII2JVonCizdqFNrUMlb1mA5t3EvhzS1mChfQJXbKFE27s06y3ZhhlIbnxmEBSo7lHFTE9Oz4usOjhnCTXrjTudE9IkySbWebgOT5Ff6j6mwKYeCxs6P6XEBtbzygONBGLUX1Yzss-tlf8JEs0ydb8CR1AHs1I8Ea26-Mz77ffwn53ly8qsGR-TBQj-yaBYc-Vzn_ZBKwOg8LYGdpzjhyE',
      translateY: true,
    },
    {
      category: 'Surgery',
      title: 'The Aesthetic of Structural Integrity',
      description: 'Why modern dental implants are more about architecture than simple mechanics.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYsiyEYZI-MO6gXz4nXWW6fJminsg1kx1YaITzxHJ99GUKT_2YmZBJqgfT2k4CMlUhaeGptx8LaLe-kkkFswXvXCr7g08VoRONsomM2LDSNsyeP94DU66aFyi5nhN6kQiD3xJmlHjeaKteQN9bZ1OFyRKDH-sK9apsb6dbTP__j9IRmnTUtrFgzF-TEaNEFtq40PWQR6MsIfS7EecQ93Ategwd4EaJ5Rn_3-Fj1l3PQo3NoxPXVbav6bAwHkfw7gOY2XMQSfc17o',
    },
  ];

  return (
    <section className="bg-[#f2f3f8] dark:bg-slate-950 py-24 mt-32 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-sans text-3xl font-bold mb-16 text-center text-[#191c1f] dark:text-white">
          Continuing Your Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {articles.map((article, index) => (
            <RelatedCard key={index} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}
