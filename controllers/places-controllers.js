const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsforAddress = require('../utils/location');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire state Building',
    description: ' one of the most famous sky scraper in the world',
    location: {
      lat: 40.7,
      lng: -74.9871516,
    },
    address: '20 w 34th st, New York, Ny 10001',
    creater: 'u1',
  },
];

const getPlaceById = (req, res, next) => {
  console.log('get request in Places');
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    return next(new HttpError('Cound not find place for the provide id', 404));
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  console.log('get request in Places');
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creater === userId;
  });

  if (!places || place.length === 0) {
    return next(new HttpError('Cound not find place for the provide id', 404));
  }

  res.status(200).json({ place });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError('Invalid  input passes', 422));
  }
  const { title, description, address, creater } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsforAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creater,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: DUMMY_PLACES });
};

const updatedPlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid  input ', 422);
  }
  const { title, description, coordinates, address, creater } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => (p.id = placeId)) };

  const placeIndex = DUMMY_PLACES.findIndex((p) => (p.id = placeId));

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => (p.id = placeId))) {
    throw new HttpError('could not find a place', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ place: DUMMY_PLACES, message: 'deleted success' });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatedPlaceById = updatedPlaceById;
exports.deletePlace = deletePlace;
