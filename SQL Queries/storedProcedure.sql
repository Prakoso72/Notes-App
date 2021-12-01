-- DROP PROCEDURE insertNote, updateNote, removeNote, addTag, removeTag, getAllNote, getANote, isNoteExists

CREATE PROCEDURE insertNote(@title VARCHAR(50), @body VARCHAR(1500))
AS
BEGIN
  BEGIN TRANSACTION
    BEGIN TRY
      INSERT INTO NOTE (Title, Body)
      VALUES(@title, @body);

      SELECT SCOPE_IDENTITY() as id;

      COMMIT TRANSACTION
    END TRY

    BEGIN CATCH
      PRINT 'Error occurred!'
      ROLLBACK TRANSACTION
    END CATCH
END
GO


CREATE PROCEDURE updateNote(@id INTEGER, @title VARCHAR(50), @body VARCHAR(1500))
AS
BEGIN
  BEGIN TRANSACTION
    BEGIN TRY
      DECLARE @upTime DATETIME
      SET @upTime = CURRENT_TIMESTAMP

      UPDATE NOTE
      SET Title = @title, Body = @body, UpdatedAt = @upTime
      WHERE ID = @id

      COMMIT TRANSACTION

      SELECT 1 as answer
    END TRY

    BEGIN CATCH
      PRINT 'Error occurred! Rollback remaining transactions: ' + CAST(@@TRANCOUNT as NVARCHAR)
      ROLLBACK TRANSACTION

      SELECT 0 as answer
    END CATCH
END
GO


CREATE PROCEDURE removeNote(@id INTEGER)
AS
BEGIN
  BEGIN TRANSACTION
    BEGIN TRY
      DECLARE @upTime DATETIME
      SET @upTime = CURRENT_TIMESTAMP

      DELETE FROM NOTE WHERE ID = @id

      COMMIT TRANSACTION
    END TRY

    BEGIN CATCH
      PRINT 'Error occurred! Rollback remaining transactions: ' + CAST(@@TRANCOUNT as NVARCHAR)
      ROLLBACK TRANSACTION
    END CATCH
END
GO


CREATE PROCEDURE addTag(@tag VARCHAR(50), @id INTEGER)
AS
BEGIN
  BEGIN TRANSACTION
    BEGIN TRY
      INSERT INTO TAG
      VALUES(@tag, @id)

      COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
      IF (EXISTS(SELECT * FROM TAG WHERE (tag = @tag) and (id = @id)))
        BEGIN
        PRINT 'Tag Exist!'
        END
      PRINT 'Error occurred! Rollback remaining transactions: ' + CAST(@@TRANCOUNT as NVARCHAR)
      ROLLBACK TRANSACTION
    END CATCH
END
GO

CREATE PROCEDURE removeTag(@tag VARCHAR(50), @id INTEGER)
AS
BEGIN
  BEGIN TRANSACTION
    BEGIN TRY
      DELETE FROM TAG WHERE (ID = @id) and (Tag = @tag)

      COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
      PRINT 'Error occurred! Rollback remaining transactions: ' + CAST(@@TRANCOUNT as NVARCHAR)
      ROLLBACK TRANSACTION
    END CATCH
END
GO

CREATE PROCEDURE getAllNote
AS
BEGIN
  BEGIN TRY
    SELECT n.ID, Title, CreatedAt, UpdatedAt, Body, Tag FROM NOTE n
    LEFT OUTER JOIN TAG t
      ON n.ID = t.ID
  END TRY
  BEGIN CATCH
    PRINT 'Error occurred!'
  END CATCH
END
GO

CREATE PROCEDURE getANote(@id INTEGER)
AS
BEGIN
  BEGIN TRY
    SELECT Title, CreatedAt, UpdatedAt, Body, Tag FROM NOTE n
    LEFT OUTER JOIN TAG t
      ON n.id = t.id
    WHERE n.id = @id
  END TRY
  BEGIN CATCH
    PRINT 'Error occurred!'
  END CATCH
END
GO

CREATE PROCEDURE isNoteExists(@id INTEGER, @tagCount INTEGER)
AS
BEGIN
  BEGIN TRY
    IF (SELECT COUNT(*) FROM NOTE n
        LEFT OUTER JOIN TAG t
          ON n.id = t.id
        WHERE n.id = @id) = @tagCount
     BEGIN
     SELECT 1 as answer
     END
    ELSE
     BEGIN
     SELECT 0 as answer
     END
  END TRY
  BEGIN CATCH
    PRINT 'Error occurred!'
  END CATCH
END
GO