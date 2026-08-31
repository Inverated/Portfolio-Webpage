import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ImageLightbox from '../common/ImageLightbox';

const DEFAULT_CYCLE_INTERVAL = 4000;

function ProjectCard({ project, featured = false }) {
  const parseBodyText = (text) => <ReactMarkdown>{text}</ReactMarkdown>;

  // Support both a single `image` string and an `images` array.
  const buildImageList = () => {
    if (Array.isArray(project?.images) && project.images.length > 0) {
      return project.images;
    }
    return project?.image ? [project.image] : [];
  };
  const images = buildImageList();

  const interval = project?.imageInterval || DEFAULT_CYCLE_INTERVAL;
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
      className={`tile tile--interactive project-card ${
        featured ? 'span-4 project-card--featured' : 'span-2'
      }`}
    >
      {images.length > 0 && (
        <button
          type="button"
          className="project-card__media"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View ${project.title} images`}
        >
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={project.title}
              className={index === currentIndex ? 'is-active' : ''}
              aria-hidden={index === currentIndex ? undefined : 'true'}
            />
          ))}
          <span className="project-card__media-hint">
            {hasMultiple ? `⤢ View all ${images.length}` : '⤢ Expand'}
          </span>
        </button>
      )}

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <div className="project-card__text">{parseBodyText(project.bodyText)}</div>
      </div>

      <div className="project-card__footer">
        {project?.links?.length > 0 && (
          <div className="project-card__links">
            {project.links.map((link) => (
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
        {project?.tags?.length > 0 && (
          <div className="project-card__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        images={images}
        open={lightboxOpen}
        startIndex={currentIndex}
        title={project.title}
        onClose={() => setLightboxOpen(false)}
      />
    </article>
  );
}

ProjectCard.propTypes = {
  featured: PropTypes.bool,
  project: PropTypes.shape({
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

export default ProjectCard;
