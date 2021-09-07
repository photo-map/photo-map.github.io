const InfoWindowContent = (props) => (
  <div className="photo-marker-info-window">
    <a href={props.icon.url} target="_blank" rel="noopener noreferrer">
      <img src={props.icon.url} alt="Photos" />
    </a>
  </div>
);

export default InfoWindowContent;
