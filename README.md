# Smart Surveying Device

![Logo](docs/images/device.png "This is the logo")

The Smart Surveying Device is an innovative solution addressing the inefficiencies in land surveying, boundary marking, and construction layout tasks. It automates stake placement with high precision, reducing both manual labor and project costs.

### Enable GitHub Pages

You can put the things to be shown in GitHub pages into the _docs/_ folder. Both html and md file formats are supported. You need to go to settings and enable GitHub pages and select _main_ branch and _docs_ folder from the dropdowns, as shown in the below image.


### Special Configurations

These projects will be automatically added into [https://projects.ce.pdn.ac.lk](). If you like to show more details about your project on this site, you can fill the parameters in the file, _/docs/index.json_

```
{
  "title": "Smart Surveying Device",
  "team": [
    {
      "name": "Jayasingha B.V.R.R",
      "email": "e20168@eng.pdn.ac.lk",
      "eNumber": "E/20/168"
    },
    {
      "name": "Malinga G.A.I",
      "email": "e20242@eng.pdn.ac.lk",
      "eNumber": "E/20/242"
    },
    {
      "name": "Padeniya S.M.N.N",
      "email": "e20276@eng.pdn.ac.lk",
      "eNumber": "E/20/276"
    },
    {
      "name": "Seneviratne G.S",
      "email": "e20369@eng.pdn.ac.lk",
      "eNumber": "E/20/369"
     }
  ],
  "supervisors": [
    {
      "name": "Dr. Isuru Nawinne",
      "email": "isurunawinne@eng.pdn.ac.lk"
    }
  ],
  "tags": ["Web", "Embedded Systems"]
}
```

Once you filled this _index.json_ file, please verify the syntax is correct. (You can use [this](https://jsonlint.com/) tool).

### Page Theme

A custom theme integrated with this GitHub Page, which is based on [github.com/cepdnaclk/eYY-project-theme](https://github.com/cepdnaclk/eYY-project-theme). If you like to remove this default theme, you can remove the file, _docs/\_config.yml_ and use HTML based website.
