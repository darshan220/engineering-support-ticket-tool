import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm px-4 lg:px-8 py-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="h-4 w-4 rounded-sm bg-primary shadow-[0_0_10px_rgba(22,193,93,0.4)]" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Dev Ticket Flow
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Empowering engineering teams with high-performance project tracking.
            Streamlined workflows, beautiful interfaces, and real-time
            collaboration.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/80">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          {/* <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/80">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/80">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-medium">
          © 2026 Dev Ticket Flow Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Global System Status: Operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
