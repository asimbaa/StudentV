import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Empowering Students Worldwide
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Your AI companion for studying in Australia, making visa applications seamless and successful
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-white/10"
        >
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-white/80">
            To revolutionize the student visa application process through cutting-edge AI technology,
            empowering international students to achieve their academic dreams in Australia with confidence
            and ease.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-white/10"
        >
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-white/80">
            To be the world's leading AI platform for student visas, setting new standards in
            immigration technology and supporting millions of students in accessing quality education
            abroad.
          </p>
        </motion.div>
      </div>

      {/* Disclaimers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-white/10 mb-16"
      >
        <h2 className="text-2xl font-semibold mb-6">Important Disclaimers</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">No Legal Advice / No Attorney-Client Relationship</h3>
            <p className="text-white/80">
              All content provided on StudentVisaAI.com is for informational purposes only and does not constitute official legal advice. Using our platform does not create an attorney-client or migration-agent-client relationship between you and Student Visa AI.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">Non-Governmental Affiliation</h3>
            <p className="text-white/80">
              Student Visa AI is not affiliated with, endorsed by, or in partnership with the Australian Government or any of its immigration departments.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">No Guarantee of Visa Approval or Outcomes</h3>
            <p className="text-white/80">
              While we provide resources and guidance, ultimate decisions regarding visa approvals are made solely by the Australian immigration authorities. Success rates or timelines may vary on a case-by-case basis.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">Limited Scope of Service (Australia)</h3>
            <p className="text-white/80">
              Our guidance focuses specifically on Australia's student visa process and may not be applicable to other countries' immigration rules. Laws and regulations change frequently; therefore, content may become outdated.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">AI/Technology Disclaimer</h3>
            <p className="text-white/80">
              We utilise AI-driven technologies (e.g., GPT-4) to generate responses, which may involve automated reasoning that can be imperfect or incomplete. AI suggestions must be evaluated by the user and should not be treated as absolute legal or professional counsel.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">Not a Migration Agency</h3>
            <p className="text-white/80">
              Student Visa AI is not a registered migration agent or migration lawyer. Users should consider seeking a registered migration agent or legal professional for complex or case-specific guidance, especially if they need guaranteed compliance.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">Privacy & Data Handling</h3>
            <p className="text-white/80">
              For detailed information about how we handle, secure, and store user data, please refer to our Privacy Policy. We may share data with third-party AI tools; users are advised to read the relevant privacy policies of these third parties.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">Governing Law & Jurisdiction</h3>
            <p className="text-white/80">
              These disclaimers and terms are governed by the laws of Australia. Any disputes arising from the use of our platform will be resolved under the jurisdiction of Australian courts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--gold))]">Contact Information</h3>
            <p className="text-white/80">
              For clarifications, complaints, or legal inquiries, please contact us at contact@studentvisaai.com or use our contact form available on the website.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-white/10 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of successful students who have achieved their dreams of studying in Australia
          with StudentVisaAI.
        </p>
        <button className="bg-[hsl(var(--gold))] text-[hsl(var(--navy))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--gold))]/90 transition-colors">
          Get Started Today
        </button>
      </motion.div>
    </div>
  );
}