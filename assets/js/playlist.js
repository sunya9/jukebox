Vue.component("playlist", {
  props: ["playlist"],
  data() {
    return {
      clipboard: null
    };
  },
  created() {
    this.clipboard = new Clipboard(".copy-link-button");
  },

  methods: {
    copyUrl(e) {
      this.clipboard.onClick(e);
    },
    humanize_time(seconds) {
      const s = seconds % 60;
      const m = Math.floor(seconds % 3600 / 60);
      const h = Math.floor(seconds / 3600);
      const padding = num => ("00" + num).slice(-2);
      return `${padding(h)}:${padding(m)}:${padding(s)}`;
    },
    is_now_playing_content(idx) {
      return (
        this.playlist.now_playing_content &&
        this.playlist.now_playing_idx === idx
      );
    },
    is_playlist_empty() {
      return !this.playlist.contents || this.playlist.contents.length === 0;
    },
    playlist_clear() {
      fetch("/playlist", { method: "DELETE" });
    },
    delete_content(index) {
      fetch(`/playlist/${index}`, { method: "DELETE" });
    },
    play_music(index) {
      fetch(`/player/seek/${index}`, { method: "POST" });
    }
  },

  template: `
  <div class="playlist panel">
    <a v-for="(content,idx) in playlist.contents" class="panel-block playlist-content"
      :class="{'now-playing-content is-active':is_now_playing_content(idx)}"
      :title="content.title"
      @click="play_music(idx)"
      >
      <div class="control columns">
        <div class="column is-8 playlist-content-title-wrapper is-clipped">
          {{ content.title }}
        </div>
        <div class="column has-text-centered is-2">
          {{ humanize_time(content.length_seconds) }}
        </div>
        <div class="column is-1 has-text-centered">
          <a class="has-text-white in-content-button copy-link-button" @click.prevent.stop="copyUrl" :data-clipboard-text="content.link">
            <i class="material-icons" title="Copy Link">link</i>
          </a>
        </div>
        <div class="column is-1 has-text-centered">
          <a class="has-text-white in-content-button" @click.prevent.stop="delete_content(idx)">
            <i class="material-icons" title="Delete">&#xE872;</i>
          </a>
        </div>
      </div>
    </a>
    <div title="Clear Playlist" class="card playlist-clear-button" :class="{ 'deactivate': is_playlist_empty() }">
      <a @click="playlist_clear()"></a>
      <i class="material-icons is-medium">delete_sweep</i>
    </div>
  </div>
  `
});
