import { GithubLogo } from "@/components/svg/GithubLogo";
import { buttonVariants } from "@/components/ui/button";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { YoutubeIcon, Twitter, Globe, Instagram } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border mt-52">
      <div className="container py-6 sm:py-12 max-w-screen-2xl flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 border-t border-border">
        {/* Left Section */}
        <div className="text-center sm:text-left sm:ml-20">
          <p className="font-semibold sm:text-lg text-foreground">
            Made with <span className="text-primary">CryptoMinds</span>
          </p>
          <p className="text-muted-foreground text-sm ">
            © 2025 SuperProductive
          </p>
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex items-center gap-2 sm:mr-20">
          {[
            { href: "/", icon: <GithubLogo />, label: "GitHub" },
            { href: "/", icon: <LinkedInLogoIcon />, label: "LinkedIn" },
            { href: "/", icon: <YoutubeIcon />, label: "YouTube" },
            { href: "/", icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
            { href: "/", icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
            { href: "/", icon: <Globe className="h-5 w-5" />, label: "Website" },
          ].map(({ href, icon, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              aria-label={label}
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className:
                  "text-muted-foreground hover:text-primary transition-colors",
              })}
            >
              {icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
