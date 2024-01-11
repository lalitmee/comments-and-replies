export const findChildCommentIndex = (id, parentId, comments) => {
  const parentComment = comments.find((comment) => comment.id === parentId);
  const indexOfComment = parentComment?.comments?.findIndex(
    (comment) => comment.id === id,
  );

  return { index: indexOfComment, parent: parentComment };
};
