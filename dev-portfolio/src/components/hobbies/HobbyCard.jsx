import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

function HobbyCard({ hobby, featured = false }) {
  const parseBodyText = (text) => <ReactMarkdown>{text}</ReactMarkdown>;

  return (
    <article
      className={`tile tile--interactive hobby-card ${
        featured ? 'span-4 hobby-card--featured' : 'span-2'
      }`}
    >
      {hobby?.image && (
        <div className="hobby-card__media">
          <img src={hobby.image} alt={hobby.title} />
        </div>
      )}

      <div className="hobby-card__body">
        <h3 className="hobby-card__title">{hobby.title}</h3>
        <div className="hobby-card__text">{parseBodyText(hobby.bodyText)}</div>
      </div>

      <div className="hobby-card__footer">
        {hobby?.links?.length > 0 && (
          <div className="hobby-card__links">
            {hobby.links.map((link) => (
              <a
                key={link.href}
                className="proj-link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
                {' '}
                ↗
              </a>
            ))}
          </div>
        )}
        {hobby?.tags?.length > 0 && (
          <div className="hobby-card__tags">
            {hobby.tags.map((tag) => (
              <span key={tag} className="hobby-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

HobbyCard.propTypes = {
  featured: PropTypes.bool,
  hobby: PropTypes.shape({
    title: PropTypes.string.isRequired,
    bodyText: PropTypes.string.isRequired,
    image: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })),
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default HobbyCard;
