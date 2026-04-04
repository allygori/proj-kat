/**
 * Mock Blog Data
 * Representative blog posts with realistic content for MVP demonstration.
 * 
 * See AGENTS.md § 3.4 for blog post field specifications.
 * Includes: title, slug, excerpt, body, author, date, category, tags, reading time, SEO metadata.
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  publishedAt: Date;
  category: string;
  tags: string[];
  readingTime: number;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

export const categories = [
  'Clinical Insights',
  'Dental Technology',
  'Patient Care',
  'Products & Reviews',
  'Practice Management',
];

export const mockPosts: BlogPost[] = [
  {
    slug: 'complete-guide-teeth-whitening',
    title: 'The Complete Guide to Modern Teeth Whitening',
    excerpt:
      'Discover the latest teeth whitening techniques, from professional treatments to at-home solutions. Learn what works and what to avoid.',
    author: 'Dr. Sarah Chen',
    publishedAt: new Date('2024-03-15'),
    category: 'Clinical Insights',
    tags: ['cosmetic-dentistry', 'teeth-whitening', 'treatment-guide'],
    readingTime: 8,
    featuredImage: 'https://images.unsplash.com/photo-1606811841689-23db3d821bda?w=800',
    metaTitle: 'Complete Guide to Teeth Whitening | Katalis Dental Blog',
    metaDescription:
      'Learn about professional and at-home teeth whitening treatments. Discover which methods are most effective and safe.',
    ogImage: 'https://images.unsplash.com/photo-1606811841689-23db3d821bda?w=1200',
    body: `
      <h2 id="introduction">Understanding Teeth Whitening</h2>
      <p>Teeth whitening is one of the most requested cosmetic dental procedures. In this comprehensive guide, we'll explore professional treatments, at-home solutions, and what the science tells us about effectiveness.</p>
      
      <h2 id="professional-treatments">Professional Whitening Treatments</h2>
      <p>Professional in-office whitening remains the gold standard for quick, dramatic results. Using higher concentrations of bleaching agents under professional supervision, these treatments can lighten teeth by several shades in a single appointment.</p>
      <p>The procedure typically involves applying protective barriers to your gums, applying the whitening gel, and using specialized light activation. Results can last 6 months to 2 years depending on lifestyle and maintenance.</p>
      
      <h2 id="at-home-solutions">At-Home Whitening Solutions</h2>
      <p>For those preferring gradual results or a more budget-friendly approach, at-home options include custom trays, whitening strips, and whitening toothpaste. While results take longer, they can be effective when used consistently.</p>
      
      <h3>Custom Trays</h3>
      <p>Custom-fit trays from your dentist ensure better coverage and retention of whitening gel, making them more effective than store-bought alternatives.</p>
      
      <h3>Whitening Strips</h3>
      <p>Over-the-counter whitening strips are convenient and generally effective, though coverage can be uneven and results vary by brand.</p>
      
      <h2 id="safety-considerations">Safety Considerations</h2>
      <p>Tooth sensitivity is the most common side effect of whitening treatments. This occurs because the bleaching process temporarily opens the tubules in your tooth structure. Using fluoride gel and sensitivity toothpaste can help manage discomfort.</p>
      <p>It's important to note that whitening works best on natural teeth. Existing restorations like crowns or veneers won't lighten, which may create aesthetic inconsistencies.</p>
      
      <h2 id="maintenance-tips">Maintaining Your Results</h2>
      <p>To prolong whitening results, limit your consumption of staining foods and beverages like coffee, red wine, and dark berries. Maintain excellent oral hygiene with regular brushing and flossing.</p>
    `,
  },
  {
    slug: 'implant-vs-bridge-comparison',
    title: 'Dental Implants vs Bridges: A Detailed Comparison',
    excerpt:
      'Deciding between implants and bridges? This detailed comparison explores the pros, cons, costs, and longevity of each option.',
    author: 'Dr. Michael Rodriguez',
    publishedAt: new Date('2024-03-10'),
    category: 'Clinical Insights',
    tags: ['implants', 'restorative-dentistry', 'comparison'],
    readingTime: 10,
    featuredImage: 'https://images.unsplash.com/photo-1626020228606-3e9b3f7e0e5d?w=800',
    metaTitle: 'Dental Implants vs Bridges: Complete Comparison | Katalis',
    metaDescription:
      'Compare dental implants and bridges. Understand the advantages, disadvantages, costs, and which option might be right for you.',
    ogImage: 'https://images.unsplash.com/photo-1626020228606-3e9b3f7e0e5d?w=1200',
    body: `
      <h2 id="overview">Comparing Two Popular Solutions</h2>
      <p>When you lose a tooth, two of the most popular restorative options are dental implants and bridges. Each has distinct advantages and limitations that we'll explore in detail.</p>
      
      <h2 id="dental-implants">What Are Dental Implants?</h2>
      <p>A dental implant is a titanium screw surgically placed in your jawbone as a replacement for the tooth root. Once integrated with the bone, an artificial crown is attached to create a complete tooth replacement.</p>
      
      <h3>Advantages of Implants</h3>
      <ul>
        <li>Preserve jawbone structure and prevent bone loss</li>
        <li>Don't require modification of adjacent teeth</li>
        <li>Very durable and long-lasting (15-20+ years)</li>
        <li>Look, feel, and function like natural teeth</li>
        <li>Easy to maintain with regular brushing and flossing</li>
      </ul>
      
      <h3>Disadvantages of Implants</h3>
      <ul>
        <li>Higher initial cost ($3,000-$6,000+ per implant)</li>
        <li>Requires sufficient bone for placement</li>
        <li>Longer treatment timeline (3-6 months for osseointegration)</li>
        <li>Not suitable for active smokers or those with certain health conditions</li>
      </ul>
      
      <h2 id="dental-bridges">What Are Dental Bridges?</h2>
      <p>A dental bridge is a prosthetic device that spans the gap created by one or more missing teeth. It's anchored to the adjacent teeth by crowns.</p>
      
      <h3>Advantages of Bridges</h3>
      <ul>
        <li>Lower cost than implants ($2,000-$4,000)</li>
        <li>Faster placement (ready in 2-3 weeks)</li>
        <li>No surgery required</li>
        <li>Works for multiple missing teeth</li>
      </ul>
      
      <h3>Disadvantages of Bridges</h3>
      <ul>
        <li>Requires modification/shaping of adjacent healthy teeth</li>
        <li>Shorter lifespan (5-10 years)</li>
        <li>Adjacent teeth bear additional stress</li>
        <li>Can trap food particles, requiring careful cleaning</li>
        <li>Doesn't prevent jaw bone loss</li>
      </ul>
      
      <h2 id="cost-comparison">Cost Comparison</h2>
      <p>While bridges have a lower upfront cost, implants often prove more economical long-term due to their durability and reduced need for replacement.</p>
    `,
  },
  {
    slug: 'electric-toothbrush-benefits',
    title: 'Are Electric Toothbrushes Really Better? What Science Says',
    excerpt:
      'We examine the research on electric toothbrushes. Are they worth the investment? Here\'s what dentists recommend.',
    author: 'Dr. Emily Watson',
    publishedAt: new Date('2024-03-05'),
    category: 'Products & Reviews',
    tags: ['oral-hygiene', 'products', 'equipment'],
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=800',
    metaTitle: 'Electric Toothbrushes: Science-Based Review | Katalis Dental',
    metaDescription:
      'Do electric toothbrushes really improve oral health? Read what dental research says about their effectiveness.',
    ogImage: 'https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=1200',
    body: `
      <h2 id="research-overview">What Does Research Tell Us?</h2>
      <p>Multiple clinical studies consistently show that electric toothbrushes, particularly oscillating-rotating models, are slightly more effective than manual toothbrushes at reducing plaque and gingivitis.</p>
      
      <h2 id="types-of-electric">Types of Electric Toothbrushes</h2>
      <p>The market offers several types of electric toothbrushes, each with different mechanisms and effectiveness levels.</p>
      
      <h3>Oscillating-Rotating</h3>
      <p>These toothbrushes move in a back-and-forth or small circular motion. They show the most clinical evidence for effectiveness in plaque removal.</p>
      
      <h3>Sonic</h3>
      <p>Sonic toothbrushes vibrate at higher frequencies and show comparable effectiveness to oscillating models.</p>
      
      <h2 id="benefits">Documented Benefits</h2>
      <ul>
        <li>Superior plaque removal in hard-to-reach areas</li>
        <li>Better for users with limited mobility</li>
        <li>Consistent pressure and motion</li>
        <li>Built-in timers encourage proper brushing duration</li>
      </ul>
      
      <h2 id="considerations">Important Considerations</h2>
      <p>The best toothbrush is the one you'll use twice daily. If an electric toothbrush makes you more likely to brush thoroughly and regularly, it's a good investment. However, excellent oral hygiene with a manual toothbrush is absolutely achievable.</p>
    `,
  },
  {
    slug: 'preventing-dental-caries',
    title: 'The Modern Approach to Preventing Dental Caries',
    excerpt:
      'Tooth decay remains a common issue. Learn the latest evidence-based strategies for prevention and early intervention.',
    author: 'Dr. James Mitchell',
    publishedAt: new Date('2024-02-28'),
    category: 'Patient Care',
    tags: ['prevention', 'oral-health', 'cavity-prevention'],
    readingTime: 9,
    featuredImage: 'https://images.unsplash.com/photo-1607613374537-b85e80c5f5f0?w=800',
    metaTitle: 'Preventing Dental Caries: Evidence-Based Guide | Katalis',
    metaDescription:
      'Discover modern strategies for preventing tooth decay and cavities. Learn what research shows about caries prevention.',
    ogImage: 'https://images.unsplash.com/photo-1607613374537-b85e80c5f5f0?w=1200',
    body: `
      <h2 id="understanding-caries">Understanding Dental Caries</h2>
      <p>Dental caries, or cavities, remain one of the most common preventable diseases. Understanding the mechanism of caries formation is key to prevention.</p>
      
      <p>Caries develop when bacteria in your mouth metabolize dietary sugars and produce acid, which demineralizes tooth structure. This process requires three factors: susceptible tooth surface, cariogenic bacteria, and fermentable carbohydrates.</p>
      
      <h2 id="prevention-strategies">Proven Prevention Strategies</h2>
      
      <h3>Fluoride Application</h3>
      <p>Fluoride remains the most evidence-based intervention for caries prevention. It strengthens enamel and inhibits bacterial metabolism. Professional fluoride applications and home fluoride products both play important roles.</p>
      
      <h3>Dietary Modification</h3>
      <p>Reducing frequency of sugar consumption, rather than total intake, is crucial. Even small amounts of sugar consumed frequently throughout the day can increase caries risk significantly.</p>
      
      <h3>Oral Hygiene</h3>
      <p>Regular mechanical removal of plaque through brushing and interdental cleaning remains fundamental. The technique matters less than consistency.</p>
      
      <h3>Sealants</h3>
      <p>Dental sealants effectively prevent caries on occlusal surfaces, particularly in children and young adults.</p>
      
      <h2 id="risk-assessment">Individual Risk Assessment</h2>
      <p>Modern caries prevention is personalized. We assess individual risk factors and tailor prevention strategies accordingly. Some patients benefit from more aggressive fluoride protocols, while others need primarily dietary counseling.</p>
    `,
  },
  {
    slug: 'orthodontics-beyond-braces',
    title: 'Modern Orthodontics: Beyond Traditional Braces',
    excerpt:
      'Explore the latest orthodontic innovations including clear aligners, lingual braces, and accelerated treatment options.',
    author: 'Dr. Lisa Park',
    publishedAt: new Date('2024-02-20'),
    category: 'Dental Technology',
    tags: ['orthodontics', 'technology', 'alignment'],
    readingTime: 7,
    featuredImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    metaTitle: 'Modern Orthodontics Beyond Braces | Katalis Dental Blog',
    metaDescription:
      'Discover the latest orthodontic treatments including clear aligners and advanced technologies for straighter teeth.',
    ogImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200',
    body: `
      <h2 id="orthodontic-evolution">The Evolution of Orthodontic Treatment</h2>
      <p>Orthodontics has undergone significant transformation over the past decade. Traditional fixed appliances remain highly effective, but patients now have more options than ever before.</p>
      
      <h2 id="clear-aligners">Clear Aligner Therapy</h2>
      <p>Clear aligners use computer-aided design and 3D printing to create custom trays that gradually move teeth. They offer significant aesthetic and comfort advantages over traditional braces.</p>
      
      <h3>Advantages</h3>
      <ul>
        <li>Nearly invisible during treatment</li>
        <li>Removable for eating and hygiene</li>
        <li>More comfortable than brackets and wires</li>
        <li>Shorter total treatment time in many cases</li>
      </ul>
      
      <h3>Limitations</h3>
      <ul>
        <li>More expensive than traditional braces</li>
        <li>Requires excellent compliance (must wear 20+ hours daily)</li>
        <li>Limited for complex cases</li>
        <li>No emergency adjustments possible</li>
      </ul>
      
      <h2 id="lingual-braces">Lingual Braces</h2>
      <p>Placed behind the teeth, lingual braces offer invisibility while maintaining the power of fixed appliances. They're excellent for patients wanting complete concealment.</p>
      
      <h2 id="accelerated-options">Accelerated Movement Options</h2>
      <p>Techniques like micro-osteoperforations and vibration-assisted therapy show promise in accelerating tooth movement, potentially reducing treatment time by 20-30%.</p>
    `,
  },
  {
    slug: 'sleep-apnea-dental-connection',
    title: 'The Dental Connection to Sleep Apnea',
    excerpt:
      'Dentists play a crucial role in screening and treating obstructive sleep apnea. Learn how your dentist can help.',
    author: 'Dr. Robert Chang',
    publishedAt: new Date('2024-02-15'),
    category: 'Patient Care',
    tags: ['sleep-apnea', 'screening', 'oral-appliances'],
    readingTime: 8,
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    metaTitle: 'Dental Sleep Medicine: Sleep Apnea Treatment | Katalis',
    metaDescription:
      'Discover how dental sleep medicine can treat obstructive sleep apnea. Learn about oral appliances and screening.',
    ogImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
    body: `
      <h2 id="sleep-apnea-overview">Understanding Sleep Apnea</h2>
      <p>Obstructive sleep apnea (OSA) affects millions worldwide and has significant health implications. Dentists are increasingly trained to screen for and treat this condition.</p>
      
      <h2 id="dental-role">The Dental Role in Sleep Medicine</h2>
      <p>Dentists can identify risk factors during routine exams, screen for sleep apnea symptoms, and provide effective treatment through oral appliance therapy (OAT).</p>
      
      <h3>Clinical Signs</h3>
      <ul>
        <li>Tooth wear patterns</li>
        <li>Scalloped tongue edges</li>
        <li>Posterior airway malposition</li>
        <li>Large tonsils</li>
      </ul>
      
      <h2 id="oral-appliances">Oral Appliances for Sleep Apnea</h2>
      <p>Mandibular advancement devices (MADs) are highly effective for mild-to-moderate OSA. These custom-fitted appliances move the lower jaw slightly forward, opening the airway during sleep.</p>
      
      <h3>Effectiveness</h3>
      <p>Studies show that well-fitted oral appliances successfully treat OSA in 70-80% of patients, with compliance rates often exceeding those of continuous positive airway pressure (CPAP) therapy.</p>
      
      <h2 id="patient-benefits">Patient Benefits</h2>
      <ul>
        <li>Improved sleep quality and daytime function</li>
        <li>Reduced cardiovascular risk</li>
        <li>Better quality of life</li>
        <li>More comfortable than CPAP for many patients</li>
      </ul>
    `,
  },
  {
    slug: 'gum-disease-silent-threat',
    title: 'Gum Disease: The Silent Threat to Your Smile',
    excerpt:
      'Periodontal disease affects 50% of adults. Understand the progression, prevention, and treatment of gum disease.',
    author: 'Dr. Maria Lopez',
    publishedAt: new Date('2024-02-10'),
    category: 'Clinical Insights',
    tags: ['periodontal', 'gum-health', 'prevention'],
    readingTime: 9,
    featuredImage: 'https://images.unsplash.com/photo-1606811841689-23db3d821bda?w=800',
    metaTitle: 'Understanding Gum Disease: Prevention & Treatment | Katalis',
    metaDescription:
      'Learn about periodontal disease, its progression from gingivitis to periodontitis, and effective treatment strategies.',
    ogImage: 'https://images.unsplash.com/photo-1606811841689-23db3d821bda?w=1200',
    body: `
      <h2 id="prevalence">The Prevalence Problem</h2>
      <p>According to recent CDC data, nearly 50% of American adults have some form of periodontal disease. Despite its prevalence, many remain unaware of their condition until it's advanced.</p>
      
      <h2 id="progression">Gingivitis to Periodontitis</h2>
      <p>Gum disease progresses through stages, and early detection is key to preventing irreversible damage.</p>
      
      <h3>Gingivitis</h3>
      <p>The earliest stage involves gum inflammation due to plaque accumulation. Characterized by bleeding, redness, and swelling, gingivitis is reversible with improved oral hygiene and professional cleaning.</p>
      
      <h3>Periodontitis</h3>
      <p>When gingivitis progresses, it damages the connective tissue and bone supporting teeth. This stage is not fully reversible, though progression can be arrested.</p>
      
      <h2 id="risk-factors">Risk Factors</h2>
      <ul>
        <li>Smoking (dramatically increases risk)</li>
        <li>Diabetes</li>
        <li>Hormonal changes</li>
        <li>Genetic predisposition</li>
        <li>Poor oral hygiene</li>
        <li>Stress</li>
      </ul>
      
      <h2 id="treatment">Treatment Approaches</h2>
      <p>Modern periodontal therapy is highly effective. Early intervention prevents tooth loss and supports overall health. Treatment options range from improved home care to surgical interventions.</p>
    `,
  },
  {
    slug: 'cosmetic-bonding-guide',
    title: 'Cosmetic Bonding: Quick Fixes for Common Smile Issues',
    excerpt:
      'Discover how dental bonding can address chips, gaps, and discoloration. A quick and affordable cosmetic solution.',
    author: 'Dr. David Thompson',
    publishedAt: new Date('2024-02-05'),
    category: 'Cosmetic Dentistry',
    tags: ['cosmetic', 'bonding', 'smile-design'],
    readingTime: 6,
    featuredImage: 'https://images.unsplash.com/photo-1580627944550-deccc08a6ba6?w=800',
    metaTitle: 'Cosmetic Bonding: Affordable Smile Enhancement | Katalis',
    metaDescription:
      'Learn how dental bonding can quickly improve your smile by addressing chips, gaps, and discoloration.',
    ogImage: 'https://images.unsplash.com/photo-1580627944550-deccc08a6ba6?w=1200',
    body: `
      <h2 id="what-is-bonding">What Is Dental Bonding?</h2>
      <p>Dental bonding involves applying tooth-colored composite resin to teeth to improve their appearance or repair damage. It's one of the most versatile and cost-effective cosmetic procedures available.</p>
      
      <h2 id="applications">Common Applications</h2>
      
      <h3>Repairing Chips and Cracks</h3>
      <p>Bonding excels at restoring chipped or cracked teeth with minimal tooth removal required.</p>
      
      <h3>Closing Gaps</h3>
      <p>Small gaps between teeth can be closed with bonding, creating a seamless, more uniform smile.</p>
      
      <h3>Addressing Discoloration</h3>
      <p>For localized staining that doesn't respond to whitening, bonding provides a permanent solution.</p>
      
      <h3>Reshaping Teeth</h3>
      <p>Teeth can be lengthened or reshaped to improve proportions and balance.</p>
      
      <h2 id="advantages">Advantages of Bonding</h2>
      <ul>
        <li>Quick procedure (typically 30-60 minutes)</li>
        <li>No anesthesia usually required</li>
        <li>Affordable compared to other cosmetic options</li>
        <li>Reversible (resin can be removed)</li>
        <li>Minimal tooth preparation</li>
      </ul>
      
      <h2 id="limitations">Limitations</h2>
      <p>While excellent for minor improvements, bonding isn't ideal for severe discoloration or large structural changes. The material also isn't as durable as porcelain veneers or crowns, with an average lifespan of 5-7 years.</p>
    `,
  },
];
