import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import Header from './Header';
import endpoints from '../constants/endpoints';
import CommunityCard from './community/CommunityCard';
import FallbackSpinner from './FallbackSpinner';
import '../css/community.css';

function Community(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetch(endpoints.community, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const numberOfItems = showMore && data ? data.community.length : 15;

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          <Fade triggerOnce>
            <div className="bento">
              {data.community?.slice(0, numberOfItems).map((community, index) => (
                <CommunityCard
                  key={community.title}
                  community={community}
                  featured={index === 0}
                />
              ))}
            </div>
          </Fade>

          {!showMore && data.community?.length > numberOfItems && (
            <div className="community-more">
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

Community.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Community;
