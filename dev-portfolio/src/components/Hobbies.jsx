import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import Header from './Header';
import endpoints from '../constants/endpoints';
import HobbyCard from './hobbies/HobbyCard';
import FallbackSpinner from './FallbackSpinner';
import '../css/hobbies.css';

function Hobbies(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetch(endpoints.hobbies, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const numberOfItems = showMore && data ? data.hobbies.length : 6;

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          <Fade triggerOnce>
            <div className="bento">
              {data.hobbies?.slice(0, numberOfItems).map((hobby, index) => (
                <HobbyCard
                  key={hobby.title}
                  hobby={hobby}
                  featured={index === 0}
                />
              ))}
            </div>
          </Fade>

          {!showMore && data.hobbies?.length > numberOfItems && (
            <div className="hobbies-more">
              <button
                type="button"
                className="btn-pill btn-ghost"
                onClick={() => setShowMore(true)}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      ) : <FallbackSpinner /> }
    </>
  );
}

Hobbies.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Hobbies;
