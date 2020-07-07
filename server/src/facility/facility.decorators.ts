import {NotFoundException} from "@nestjs/common";
import {Controller} from "@nestjs/common/interfaces";
import Config from "../config";

/**
 * Check if the facility is in one of the right one
 * @param target
 * @param propertyName
 * @param propertyDescriptor
 * @constructor
 */
export function CheckFacility(
    target: Controller,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor,
): PropertyDescriptor {

    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = function (...args: any[]): any {
        if (args.length === 0) throw new NotFoundException();

        const facility = args[0];
        if (!Config.allowedFacilities.includes(facility)) throw new NotFoundException();

        // Call the original function
        return originalMethod.apply(this, args);
    };
    return propertyDescriptor;
}
