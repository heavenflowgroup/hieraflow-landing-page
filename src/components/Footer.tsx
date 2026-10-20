import { Building2, Mail, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/components/TrafficConsent";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16" role="contentinfo" aria-label="Informations du site">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center" aria-hidden="true">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">Hieraflow</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              La solution innovante pour structurer et visualiser vos organigrammes 
              d'entreprise de manière intuitive et efficace.
            </p>
          </div>
          
          <nav className="space-y-4" aria-labelledby="footer-solution">
            <h3 id="footer-solution" className="text-lg font-semibold">Solution</h3>
            <ul className="space-y-2 text-background/80" role="list">
              <li role="listitem"><a href="#fonctionnalites" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Organigramme Interactif</a></li>
              <li role="listitem"><a href="#fonctionnalites" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Trombinoscope</a></li>
              <li role="listitem"><a href="#fonctionnalites" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Gestion des Rôles</a></li>
              <li role="listitem"><a href="#fonctionnalites" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Interface CMS</a></li>
            </ul>
          </nav>
          
          <nav className="space-y-4" aria-labelledby="footer-deployment">
            <h3 id="footer-deployment" className="text-lg font-semibold">Déploiement</h3>
            <ul className="space-y-2 text-background/80" role="list">
              <li role="listitem"><a href="#" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Solution Cloud</a></li>
              <li role="listitem"><a href="#" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Installation On-Premise</a></li>
              <li role="listitem"><a href="#contact" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Support & Formation</a></li>
              <li role="listitem"><a href="#" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Documentation</a></li>
            </ul>
          </nav>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <address className="space-y-3 text-background/80 not-italic">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-accent" aria-hidden="true" />
                <a href="mailto:contact@hieraflow.com" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">
                  contact@hieraflow.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-secondary" aria-hidden="true" />
                <span>Lun - Ven : 9h - 18h</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-accent" aria-hidden="true" />
                <a href="/#contact" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">
                  Prendre rendez-vous
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary-glow" aria-hidden="true" />
                <span>France • Europe • International</span>
              </div>
            </address>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60">
              © 2024 Hieraflow. Tous droits réservés.
            </p>
            <nav aria-label="Liens légaux">
              <ul className="flex flex-wrap justify-center items-center gap-4 text-background/60" role="list">
                <li role="listitem"><a href="/accessibilite" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Accessibilité RGAA</a></li>
                <li role="listitem"><a href="/confidentialite" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Politique de confidentialité</a></li>
                <li role="listitem"><Button data-consent-ui variant="link" onClick={openCookieSettings} className="text-background/80 h-auto p-0 whitespace-normal">Paramètres des cookies</Button></li>
                <li role="listitem"><a href="#" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">Mentions légales</a></li>
                <li role="listitem"><a href="#" className="hover:text-accent transition-colors focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent">CGU</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;