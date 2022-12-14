import * as sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import CarModel from '../../../models/Car.model';
import CarService from '../../../services/Car.service';
import CarController from '../../../controllers/Car.controller';
import { Request, Response } from 'express';
import { carRequest, carResponse, carsResponse } from '../../mocks/carsMocks';

describe('Car controller tests', () => {
  const carModel = new CarModel();
  const carService = new CarService(carModel);
  const carController = new CarController(carService);

  const req = {} as Request;
  const res = {} as Response;

  before(async () => {
    sinon.stub(carService, 'create').onFirstCall().resolves(carResponse);
    sinon.stub(carService, 'read').onFirstCall().resolves(carsResponse);
    sinon.stub(carService, 'readOne').onFirstCall().resolves(carResponse);

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
  });

  after(() => {
    sinon.restore();
  });

  describe('Creating a car', () => {
    it('Should return the car with status code 201 when receive valid request', async () => {
      req.body = carRequest;
      await carController.create(req, res);

      expect((res.status as sinon.SinonStub).calledWith(201)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith(carResponse)).to.be.true;
    });

    // it('Should return the car with status code 400 when receive invalid request', async () => {
    //   const message = 'Invalid fields. Verify the data and try again.';
    //   req.body = {};
    //   await carController.create(req, res);

    //   expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    //   // expect((res.json as sinon.SinonStub).calledWith({ message })).to.be.true;
    // });
  });

  describe('Listing all cars', () => {
    it('Should list all cars', async () => {
      await carController.read(req, res);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith(carsResponse)).to.be.true;
    });
  });

  describe('Listing a car', () => {
    it('Should list a car when receive a valid id', async () => {
      req.params = { id: carResponse._id };
      await carController.readOne(req, res);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith(carResponse)).to.be.true;
    });

    // it('Should return the car with status code 404 when receive an invalid id', async () => {
    //   const message = 'Car not found.';
    //   req.params = { id: 'Inexistent_id' };
    //   await carController.readOne(req, res);

    //   expect((res.status as sinon.SinonStub).calledWith(404)).to.be.true;
    //   // expect((res.json as sinon.SinonStub).calledWith({ message })).to.be.true;
    // });
  });
});
