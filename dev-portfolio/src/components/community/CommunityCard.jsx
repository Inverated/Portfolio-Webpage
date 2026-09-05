import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ImageLightbox from '../common/ImageLightbox';

const DEFAULT_CYCLE_INTERVAL = 4000;

function CommunityCard({ community, featured = false }) {
  const parseBodyText = (text) => <ReactMarkdown>{text}</ReactMarkdown>;

  // Support both a single `image` string and an `images` array.
  const buildImageList = () => {
    if (Array.isArray(community?.images) && community.images.length > 0) {
      return community.images;
    }
    return community?.image ? [community.image] : [];
  };
  const images = buildImageList();

  const interval = community?.imageInterval || DEFAULT_CYCLE_INTERVAL;
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
      className={`tile tile--interactive community-card ${
        featured ? 'span-4 community-card--featured' : 'span-2'
      }`}
    >
      {images.length > 0 && (
        <button
          type="button"
          className="community-card__media"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View ${community.title} images`}
        >
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={community.title}
              className={index === currentIndex ? 'is-active' : ''}
              aria-hidden={index === currentIndex ? undefined : 'true'}
            />
          ))}
          <span className="community-card__media-hint">
            {hasMultiple ? `⤢ View all ${images.length}` : '⤢ Expand'}
          </span>
        </button>
      )}

      <div className="community-card__body">
        <h3 className="community-card__title">{community.title}</h3>
        <div className="community-card__text">{parseBodyText(community.bodyText)}</div>
      </div>

      <div className="community-card__footer">
        {community?.links?.length > 0 && (
          <div className="community-card__links">
            {community.links.map((link) => (
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
        {community?.tags?.length > 0 && (
          <div className="community-card__tags">
            {community.tags.map((tag) => (
              <span key={tag} className="community-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        images={images}
        open={lightboxOpen}
        startIndex={currentIndex}
        title={community.title}
        onClose={() => setLightboxOpen(false)}
      />
    </article>
  );
}

CommunityCard.propTypes = {
  featured: PropTypes.bool,
  community: PropTypes.shape({
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

export default CommunityCard;
