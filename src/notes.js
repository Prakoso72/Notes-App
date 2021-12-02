/* eslint-disable space-before-function-paren */
class Note {
  constructor(note = []) {
    this.size = note.length;
    this.tags = [];
    this.pushNote(note);
  };

  pushNote(note) {
    if (note.length > 0) {
      this.id = note[0].ID;
      this.title = note[0].Title;
      this.createdAt = note[0].CreatedAt;
      this.updatedAt = note[0].UpdatedAt;
      this.body = note[0].Body;
      note.forEach((e) => {
        this.tags.push(e.Tag);
      });
    }
  }

  getNote() {
    if (this.size > 0) {
      return {
        ID: this.id,
        Title: this.title,
        CreatedAt: this.createdAt,
        UpdatedAt: this.updatedAt,
        Tag: this.tags,
        Body: this.body
      };
    }

    return undefined;
  }
}

module.exports = Note;
