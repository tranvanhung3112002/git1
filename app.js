function getData(url, cb) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        cb(undefined, JSON.parse(xhr.responseText));
      } else {
        cb(new Error(xhr.statusText));
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
}

const USERS = "https://jsonplaceholder.typicode.com/users";
const ALBUMS = "https://jsonplaceholder.typicode.com/albums";
const PHOTOS = "https://jsonplaceholder.typicode.com/photos";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChooseUser = this.handleChooseUser.bind(this);
    this.state = { users: [], albums: [] };
  }

  componentDidMount() {
    // Problem 01
    // YOUR CODE HERE
    // Lấy tất cả USERS
    getData(USERS, (error, userData) => {
      if (error) {
        // Xử lý lỗi khi không thể lấy dữ liệu USERS
        console.error("Error ", error);
      } else {
        // Lưu trữ dữ liệu USERS vào trạng thái đã lấy được
        this.setState({ users: userData });
      }
    });
  }

  async handleChooseUser(event) {
    // Id of user when select
    var userId = event.target.value;

    // Problem02
    // YOUR CODE HERE
    // Lấy tất cả album của USERS
    getData(ALBUMS + "?userId=" + userId, (error, albumData) => {
      if (error) {
        // Xử lý lỗi khi không thể lấy dữ liệu album
        console.error("Error", error);
      } else {
        // Lưu trữ dữ liệu album vào trạng thái
        this.setState({ albums: albumData });
        // Lấy tất cả ảnh của các album
        albumData.forEach((album) => {
          getData(PHOTOS + "?albumId=" + album.id, (error, photoData) => {
            if (error) {
              // Xử lý PHOTOS khi không thể lấy dữ liệu PHOTOS
              console.error("Error ", error);
            } else {
              album.photos = photoData;
              // Cập nhật trạng thái album sau khi lấy xong PHOTOS
              this.setState({ albums: albumData });
            }
          });
        });
      }
    });
  }

  renderAlbums() {
    const { albums } = this.state;

    if (!albums) {
      return <h1>Loading albums...</h1>;
    }

    return albums.map(function (album, index) {
      return (
        <div key={"album" + index} className="row">
          <h4 className="col-12 pt-4">Album {album.id}</h4>
          {album.photos ? (
            album.photos.map(function (photo, index) {
              return (
                <div
                  key={"photo" + index}
                  className="card col-3 pt-2"
                  style={{ width: "18rem;" }}
                >
                  <img
                    class="card-img-top"
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                  />
                  <div class="card-body">
                    <p class="card-text">
                      <strong>Photo {photo.id}:</strong> {photo.title}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <h2>Loading photos...</h2>
          )}
        </div>
      );
    });
  }

  render() {
    const pageTitle = "Photo Galery Final"
    if (!this.state.users) {
      return <h1>Loading...</h1>;
    }

    return (
      <div className="container-fluid">
        <h1>{pageTitle}</h1>
        <select class="custom-select" onChange={this.handleChooseUser}>
          <option selected>Choose user...</option>
          {this.state.users.map((user, index) => {
            return (
              <option key={"option" + index} value={user.id}>
                {user.name}
              </option>
            );
          })}
        </select>
        <div className="albums-wrapper">{this.renderAlbums()}</div>
      </div>
    );
  }
}

ReactDOM.render (
  React.createElement("h1",{className:"my-class", id:"myId"},[
    React.createElement("h1",undefined,"Hello Huyen"),
    React.createElement("h1",undefined,"Hello Thuyet"),
    React.createElement("h1",undefined,"Hello Dat")
  ]),
  document.getElementById("root")
)

ReactDOM.render(<App />, document.querySelector("#root"));
