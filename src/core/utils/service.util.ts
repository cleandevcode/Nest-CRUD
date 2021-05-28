import { InternalServerErrorException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import axios from 'axios';
import * as fs from 'fs';

const jwtService = new JwtService({});

export const adjudicate = (body) => {
  const privateKey = fs.readFileSync('src/core/constants/private.key', 'utf8');
  const signOptions: JwtSignOptions = {
    issuer: 'Gojitech',
    subject: 'Aurora',
    audience: 'http://gojitech.co',
    expiresIn: '12h',
    algorithm: 'RS512',
    privateKey,
  };

  const Token = jwtService.sign(body, signOptions);
  return axios
    .post(process.env.AJUDICATE_SERVICE, { Token })
    .then((res) => res.data)
    .catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
};
