const AutoPrefixer = require("autoprefixer");
const FlexBoxFixes = require("postcss-flexbugs-fixes");

module.exports = {
   plugins: [
      AutoPrefixer({
         browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 11" // I  Don't support IE10 anyway
         ],
         flexbox: "no-2009"
      }),
      FlexBoxFixes()
   ]
};
