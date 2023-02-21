export default {
  QUERY_USER_SEL_BY_USERNAME: {
    query: `SELECT
    usr.id,
    usr.username,
    usr.password,
    usr.firstname,
    usr.lastname,
    usr.status,
    r.code as role,
    r.description as role_description
    FROM usr
    JOIN usr_role ur ON ur.userid = usr.id
    JOIN role r ON r.code = ur.rolecode
    WHERE username = $username
    `,
  },
}
