USE Notes

EXEC insertNote @title = 'tes', @body = 'tes123';
DECLARE @ID INT
SET @ID = (SELECT TOP 1 id FROM NOTE);
EXEC addTag @tag = 'tag2', @id = @ID;

SELECT * FROM NOTE WHERE title = 'tes'
SELECT * FROM TAG