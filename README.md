## Data Preparation

```sh
# download
wget -O wos_3d-chromatin-new.qdpx "https://www.dropbox.com/scl/fi/ssod0u6h26ex4mw6th9vi/wos_3d-chromatin-new.qdpx?rlkey=zhbgdzvaxzyxn9oavsc3bukck&dl=1"

# pre-process annotations
uv run ./scripts/qdpx-to-json.py \
  --input wos_3d-chromatin-new.qdpx \
  --output ./data

# prepare (optimized) assets for page
node ./scripts/prepare-assets.js
```

## Release

To speed up CI, we avoid rerunning the processing steps above and instead
publish a GitHub Release that includes the optimized static assets as a zip
file.

To generate the zip file:

```sh
cd static/images
zip -r ../images.zip .
```

Then upload `images.zip` to a new GitHub Release. See the
[workflow](./.github/workflows/deploy.yml) for how this file is unzipped and
used when deploying the site.
