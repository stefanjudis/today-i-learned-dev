import useTilPosts from "../hooks/use-til-posts";
import useUser from "../hooks/use-user";

const PostList = () => {
  const { user } = useUser();
  const { tilPosts, loading, error, updateTilPost } = useTilPosts();

  if (loading) {
    return "loading...";
  }

  return (
    <>
      <ul>
        {tilPosts.map((doc) => {
          const { url, title, upvoters } = doc.data();

          return (
            <li key={doc.id}>
              {user ? (
                <button
                  type="button"
                  aria-live="polite"
                  aria-label={`${
                    upvoters.includes(user.id) ? "Undo vote" : "Vote"
                  } for ${title}`}
                  onClick={() => {
                    if (upvoters.includes(user.id)) {
                      const newUpvoters = upvoters.filter(
                        (userId) => userId !== user.id
                      );
                      updateTilPost(doc.id, {
                        upvoters: newUpvoters,
                      });
                    } else {
                      updateTilPost(doc.id, {
                        upvoters: [...upvoters, user.id],
                      });
                    }
                  }}
                >
                  {upvoters.includes(user.id) ? "Undo vote" : "upvote"}
                </button>
              ) : (
                ""
              )}
              <a href={url}>
                <span id={`${doc.id}-title`}>{title}</span>
              </a>
              <span>{upvoters.length || "0"}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PostList;
