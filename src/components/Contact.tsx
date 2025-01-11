import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Mail className="w-6 h-6 text-[hsl(var(--gold))] mr-4" />
        <div>
          <p className="font-medium">Email</p>
          <a href="mailto:contact@studentvisaai.com" className="text-white/80 hover:text-[hsl(var(--gold))]">
            contact@studentvisaai.com
          </a>
        </div>
      </div>

      <div className="flex items-center">
        <Phone className="w-6 h-6 text-[hsl(var(--gold))] mr-4" />
        <div>
          <p className="font-medium">Phone</p>
          <a href="tel:+61291234567" className="text-white/80 hover:text-[hsl(var(--gold))]">
            +61 2 9123 4567
          </a>
        </div>
      </div>

      <div className="flex items-center">
        <MapPin className="w-6 h-6 text-[hsl(var(--gold))] mr-4" />
        <div>
          <p className="font-medium">Office</p>
          <p className="text-white/80">
            Level 25, 123 George Street<br />
            Sydney, NSW 2000<br />
            Australia
          </p>
        </div>
      </div>
    </div>
  );
}