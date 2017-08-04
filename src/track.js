const Provider = require("./provider");

module.exports = class Track {
  constructor({ provider, link, length_seconds, title, id, thumbnail_link }) {
    this.provider = provider;
    this.link = link;
    this.length_seconds = length_seconds;
    this.title = title;
    this.id = id;
    this.thumbnail_link = thumbnail_link;
  }

  static async create_by_link(link) {
    const provider = Provider.find_by_link(link);
    if (!provider) {
      throw new Error("This link belongs to an unsupported provider");
    }

    const provider_name = provider.name;
    const track = new this({
      provider: provider_name,
      link,
      length_seconds: await provider.get_length_seconds(link),
      title: await provider.get_title(link),
      id: provider.get_id(link),
      thumbnail_link: await provider.get_thumbnail_link(link)
    });

    if (!track.length_seconds) {
      throw new Error(
        `This '${provider_name}' link can not be played at the moment`
      );
    }

    return track;
  }

  static async create_by_links(links = []) {
    const tracks = [];
    const errors = [];

    for (let link of links) {
      try {
        const track = await Track.create_by_link(link);
        tracks.push(track);
      } catch (e) {
        errors.push({
          link,
          err_msg: e && e.message
        });
      }
    }

    return { tracks, errors };
  }

  to_json() {
    return {
      provider: this.provider,
      link: this.link,
      length_seconds: this.length_seconds,
      title: this.title,
      id: this.id,
      thumbnail_link: this.thumbnail_link
    };
  }
};
