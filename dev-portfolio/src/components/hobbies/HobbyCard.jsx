import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ImageLightbox from '../common/ImageLightbox';

const DEFAULT_CYCLE_INTERVAL = 4000;

function HobbyCard({ hobby, featured = false }) {
  const parseBodyText = (text) => <ReactMarkdown>{text}</ReactMarkdown>;

  // Support both a single `image` string and an `images` array.
  const buildImageList = () => {
    if (Array.isArray(hobby?.images) && hobby.images.length > 0) {
      return hobby.images;
    }
    return hobby?.image ? [hobby.image] : [];
  };
  const images = buildImageList();

  const interval = hobby?.imageInterval || DEFAULT_CYCLE_INTERVAL;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const hasMultiple = images.length > 1;

  return (
    <article
      className={`tile tile--interactive hobby-card ${
        featured ? 'span-4 hobby-card--featured' : 'span-2'
      }`}
    >
      {images.length > 0 && (
        <button
          type="button"
          className="hobby-card__media"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View ${hobby.title} images`}
        >
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={hobby.title}
              className={index === currentIndex ? 'is-active' : ''}
              aria-hidden={index === currentIndex ? undefined : 'true'}
            />
          ))}
          <span className="hobby-card__media-hint">
            {hasMultiple ? `⤢ View all ${images.length}` : '⤢ Expand'}
          </span>
        </button>
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

      <ImageLightbox
        images={images}
        open={lightboxOpen}
        startIndex={currentIndex}
        title={hobby.title}
        onClose={() => setLightboxOpen(false)}
      />
    </article>
  );
}

HobbyCard.propTypes = {
  featured: PropTypes.bool,
  hobby: PropTypes.shape({
    title: PropTypes.string.isRequired,
    bodyText: PropTypes.string.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    imageInterval: PropTypes.number,
    links: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })),
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default HobbyCard;
