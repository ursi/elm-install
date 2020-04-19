### CLI

`elm-install [[-a] <package>|<alias>]+`

The `-a` flag adds an alias for the package in your `.elminstall` that is equal to the name of the package minus the author, the `/`, and the `elm-` if it exists.

Ex:

`author/elm-package` gets the alias `package`.

`author/package2` gets the alias `package2`.

### Config (JSON)

located at `~/.elminstall`
* **shell:** Use this to specify a path to a Bash shell if Node.js won't use one by default.
* **aliases:** All the aliases used for Elm packages.
