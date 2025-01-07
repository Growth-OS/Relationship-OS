interface ExternalLinksProps {
  website?: string;
  linkedin?: string;
}

export const ExternalLinks = ({ website, linkedin }: ExternalLinksProps) => {
  if (!website && !linkedin) return <span>-</span>;

  return (
    <div className="space-y-1">
      {website && (
        <a 
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 hover:underline block"
        >
          Website
        </a>
      )}
      {linkedin && (
        <a 
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 hover:underline"
        >
          LinkedIn
        </a>
      )}
    </div>
  );
};