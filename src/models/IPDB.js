import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const IPDB = sequelize.define('ipdb', {
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  timestamps: true
});

export default IPDB;