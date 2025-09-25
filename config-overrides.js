const {
  addWebpackPlugin,
  override,
} = require('customize-cra');
const webpack = require('webpack');

let contacts = null;
try {
  contacts = require('./contacts');
} catch(err) {
  console.error(`No contacts due to ${err}`);
}

module.exports = {
  webpack: override(
    addWebpackPlugin(new webpack.DefinePlugin({
      CONTACTS: JSON.stringify(contacts),
    }))
  )
}
