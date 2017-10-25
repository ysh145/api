import qs from 'querystring'

const examplesMeta = [];

export function addToMainPage(example) {
  examplesMeta.push(example);
}

function renderExamplesLinks() {
  const examplesHtml = examplesMeta.map(meta => {
    const titleHtml = `<h4>
      ${meta.title}
    </h4>`;

    let descriptionHtml = '';
    if (meta.description) {
      descriptionHtml = `<p>${meta.description}</p>`
    }

    const queries = meta.queries.map(queryData => {
      if (queryData.variables){
        return `<b><a href="${meta.uri}/?query=${qs.escape(queryData.query)}&variables=${qs.escape(queryData.variables)}">${queryData.title}</a></b>`;
      } else {
        let _variables = JSON.stringify({})
        return `<b><a href="${meta.uri}/?query=${qs.escape(queryData.query)}&variables=${qs.escape(_variables)}">${queryData.title}</a></b>`;
      }
      
    });
    const queriesHtml = `<ul><li>${queries.join('</li><li>')}</li></ul>`

    return `${titleHtml}${descriptionHtml}${queriesHtml}`;
  });

  return `<ol><li>${examplesHtml.join('</li><li>')}</li></ol>`;
}

export function mainPage() {
  return `
    <html>
      <head>
        <title>API Documents</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1>API Documents</h1>
          ${renderExamplesLinks()}


        <br /><br /><br /><br /><br />
      </body>
    </html>
  `;
}
