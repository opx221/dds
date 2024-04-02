import detectContentType from 'detect-content-type';
import bufferToDataURI from '../../utils/bufferToDataURI';

const photosPanel = ({ contents }) =>
`${
  contents.length === 0
    ? '<p>no photos</p>'
    : ''
}
<ul>
  ${
    contents
      .map((content) => (
        `<li>
          <img src="${bufferToDataURI(detectContentType(content), content)}">
        </li>`
      ))
      .join('')
  }
</ul>
`;

export default photosPanel;
