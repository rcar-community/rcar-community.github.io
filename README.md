# rcar-community.github.io
Github pages for rcar-community

https://rcar-community.github.io/

<details>

<summary>Development memo</summary>

# How to deploy

1. Directory structure

release helper script expects development and release repository are in same directory.

```plaintext
direcotry
 +--- rcar-community.github.io
 `--- rcar-community-board
```

2. Copy files from development to release repository

```bash
cd rcar-community.github.io
./release.sh
```

3. Deploy website

Commit all changes, then push it.

</details>

