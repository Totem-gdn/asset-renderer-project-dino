'use strict'

const path = require('path');
const fs = require('fs')
const { readdir } = require('fs/promises');
const nftHelper = require('../../helpers/dna-parser')

class NFTController {
  async get (req, res, next) {
    const { type, id } = req.params
    let { width = 500, height = 500 } = req.query
    if (!type || !id) {
      res.status(404).json({ error: 'Wrong format' })
    }

    if (type === 'item' || type === 'avatar') {
      const nft = await nftHelper.get(type, id);
      nft.primaryShadow = '#5823C9'; // nft.primary_color.replace(')', ', 0.5)').replace('rgb', 'rgba');
      console.log('nfft', nft);

      if (nft) {
        res.setHeader('Content-Type', 'image/svg+xml');
        if (type === 'item') {
          res.render(`layouts/${nft.weapon_material}`, {
            layout: `${nft.weapon_material}.hbs`,
            ...nft,
            width: width,
            height: height
        })
        }
        if (type === 'avatar') {
          
          nft.primary_color = nft.primary_color.replace(')', ', 0.5)').replace('rgb', 'rgba');

          res.render(`layouts/avatar`, {
            layout: `avatar.hbs`,
            ...nft,
            width: width,
            height: height
          })
        }
      } else {
        res.status(404).json({ error: 'File not found' })
        
      }
      
    }  else {
      res.status(404).json({ error: 'File not found' })
    }
  }
}

module.exports = new NFTController()
