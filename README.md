## Data Preparation

```sh
# download
wget -O wos_3d-chromatin-new.qdpx "https://www.dropbox.com/scl/fi/ssod0u6h26ex4mw6th9vi/wos_3d-chromatin-new.qdpx?rlkey=zhbgdzvaxzyxn9oavsc3bukck&dl=1"

# process
uv run ./scripts/qdpx-to-json.py \
  --input wos_3d-chromatin-new.qdpx \
  --output ./data

# prepare assets
cp ./data/output.json src/output.json
node ./scripts/compress-images.cjs
```
