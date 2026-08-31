import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import '../../css/image-lightbox.css';

/**
 * Full-screen image viewer. Renders when `open` is true, shows the image at
 * `startIndex`, and lets the user page through `images` with the on-screen
 * arrows, thumbnails, or the keyboard (Left/Right/Escape).
 */
function ImageLightbox({
  images, open, startIndex = 0, title = '', onClose,
}) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', onKeyDown);
    // Prevent the page behind the lightbox from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || images.length === 0) return null;

  const hasMultiple = images.length > 1;

  // Render into document.body via a portal. This keeps the fixed-position
  // overlay out of any ancestor that has a `transform` (e.g. the card's
  // hover lift), which would otherwise become the containing block and clip
  // the "full screen" overlay to the card — causing it to jump/flicker.
  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Image viewer'}
    >
      {/* Sits behind the content; clicking it (the backdrop) closes the viewer. */}
      <button
        type="button"
        className="lightbox__backdrop"
        aria-label="Close image viewer"
        onClick={onClose}
      />

      <button
        type="button"
        className="lightbox__close"
        aria-label="Close"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="lightbox__stage">
        {hasMultiple && (
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous image"
            onClick={goPrev}
          >
            ‹
          </button>
        )}

        <figure className="lightbox__figure">
          <img
            src={images[index]}
            alt={`${title || 'Image'} ${index + 1} of ${images.length}`}
          />
          {hasMultiple && (
            <figcaption className="lightbox__counter">
              {index + 1}
              {' / '}
              {images.length}
            </figcaption>
          )}
        </figure>

        {hasMultiple && (
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next image"
            onClick={goNext}
          >
            ›
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className="lightbox__thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`lightbox__thumb ${i === index ? 'is-active' : ''}`}
              aria-label={`View image ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

ImageLightbox.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  startIndex: PropTypes.number,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

ImageLightbox.defaultProps = {
  startIndex: 0,
  title: '',
};

export default ImageLightbox;
