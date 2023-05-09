const {Schema, model} = require('mongoose');
const {handleMongooseError} = require('../helpers');

const businessProcessCatalogSchema = new Schema({        
    catalog: {
      type: Schema.Types.Mixed,
      required: true,   
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }          
},{versionKey: false});

businessProcessCatalogSchema.post("save",handleMongooseError);

const BusinessProcessCatalog = model('business-process-catalog',businessProcessCatalogSchema);


module.exports = {
    BusinessProcessCatalog
};