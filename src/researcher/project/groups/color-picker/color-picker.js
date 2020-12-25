export function colorBox(tag) {
  const rowOneColors = ['#EDEDED', '#F62012', '#E91D62', '#8E24AA', '#5E35B1', '#3E50B4'];
  const rowTwoColors = ['#2095F2', '#02A8F4', '#01BBD4', '#019587', '#4BAF4F', '#8BC24A'];
  const rowThreeColors = ['#CCDB38', '#F3D915', '#FEC107', '#FF6536', '#6D4C41', '#546E7A'];

  return `<div class="color-drop">
            <div class="header">
              <div class="text">CHOOSE A COLOR</div>
              <div class="line"></div>
            </div>
            <div class="color-picker">
              <div class="row">
                ${generateCircleRow(rowOneColors, tag)}
              </div>
              <div class="row">
                ${generateCircleRow(rowTwoColors, tag)}
              </div>
              <div class="row">
                ${generateCircleRow(rowThreeColors, tag)}
              </div>
            </div>
            <div class="apply-button-row">
              <div class="button-container" id="apply">
                <div class="btn btn-sm btn-secondary">Apply</div>
              </div>
            </div>
          </div>`;
}


function generateCircleRow(colorsArray, tag) {
  let html = '';

  for (let i = 0; i < colorsArray.length; i++) {
    if (tag.color && colorsArray[i].toLowerCase() === tag.color.toLowerCase()) {
      html += `<div id="${colorsArray[i]}" class="circle" style="background-color: ${colorsArray[i]}; border: 3px solid #9bb6f3;" data-selected="1"></div>`;
    } else {
      html += `<div id="${colorsArray[i]}" class="circle" style="background-color: ${colorsArray[i]}" data-selected="0"></div>`;
    }
  }
  return html;
}
