{
  outputs = { self, nixpkgs, utils }:
    utils.builders.simple-js {
      name = "elm-install";
      version = "0.1.1";
      inherit nixpkgs;
      path = ./index.js;
    }
      // utils.simpleShell [ "nodejs" ] nixpkgs;
}
