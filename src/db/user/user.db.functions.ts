export default {
  UFN_USER_INS: {
    query: `SELECT *
    FROM ufn_usr_ins(
    $id,
    $username,
    $password,
    $firstname,
    $lastname,
    $status,
    $role,
    $u_id
    )`,
  },
  UFN_USER_SEL: {
    query: `SELECT *
    FROM ufn_usr_sel()`,
  },
  UFN_USER_SEL_ONE: {
    query: `SELECT *
    FROM ufn_usr_sel_one(
      $id
    )`,
  },
}
