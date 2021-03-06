import React from 'react';

export default () => (
    <>
        <div className='row halign space-evenly'>
            <h1 className='site-about-location-title'>My Physical Location</h1>
        </div>
        <div className='row halign space-evenly'>
            <iframe className='site-about-location-map' id='gmap_canvas' src='https://maps.google.com/maps?q=kern%20county%2C%20ca&t=&z=7&ie=UTF8&iwloc=&output=embed'
                width='600' height='500' frameBorder='0' scrolling='no' marginHeight='0' marginWidth='0'
            >
            </iframe>
        </div>
    </>
);