import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PROJECT_COLLEGE_STUDENT_FEE,
  PROJECT_SCHOOL_STUDENT_FEE,
  PROJECT_UNIVERSITY_STUDENT_FEE,
  PROJECT_STUDENT_TYPE_LABELS,
  projectFeeForStudentType,
  resolveRegistrationFee,
} from "../../src/lib/registration/fees";
import { parseProjectStudentType } from "../../src/lib/registration/project-student-type";

describe("project registration fees", () => {
  it("exposes updated fee constants", () => {
    assert.equal(PROJECT_SCHOOL_STUDENT_FEE, 200);
    assert.equal(PROJECT_COLLEGE_STUDENT_FEE, 500);
    assert.equal(PROJECT_UNIVERSITY_STUDENT_FEE, 500);
  });

  it("resolves fee by project student type", () => {
    assert.equal(projectFeeForStudentType("School Student"), 200);
    assert.equal(projectFeeForStudentType("College Student"), 500);
    assert.equal(projectFeeForStudentType("University Student"), 500);
  });

  it("labels match business naming", () => {
    assert.equal(PROJECT_STUDENT_TYPE_LABELS["School Student"].short, "School Level Project");
    assert.equal(PROJECT_STUDENT_TYPE_LABELS["College Student"].short, "College Level Project");
    assert.equal(PROJECT_STUDENT_TYPE_LABELS["University Student"].short, "University Level Project");
  });

  it("resolveRegistrationFee for Projects uses student type", () => {
    assert.equal(
      resolveRegistrationFee("Projects", { projectStudentType: "School Student" }),
      200
    );
    assert.equal(
      resolveRegistrationFee("Projects", { projectStudentType: "College Student" }),
      500
    );
    assert.equal(
      resolveRegistrationFee("Projects", { projectStudentType: "University Student" }),
      500
    );
  });

  it("resolveRegistrationFee returns 0 for closed Accommodation type", () => {
    assert.equal(resolveRegistrationFee("Accommodation", { accommodationBedType: "Single Bed" }), 0);
  });

  it("parseProjectStudentType infers university from category text", () => {
    assert.equal(parseProjectStudentType(undefined, "University Level Project"), "University Student");
    assert.equal(parseProjectStudentType("University Student"), "University Student");
  });
});
